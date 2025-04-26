// app/api/weather/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";
import wkx from "wkx";

const sendEmail = async (email: string, subject: string, message: string) => {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: email,
            subject: subject,
            html: message,
        }),
    });
    return res;
};

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API;
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: NextRequest) {
    try {
        if (!OPENWEATHER_API_KEY) {
            return new NextResponse("Missing OpenWeatherMap API key", { status: 500 });
        }

        if (!process.env.RESEND_API_KEY) {
            return new NextResponse("Missing Resend API key", { status: 500 });
        }

        const supabase = await createClient();

        // Fetch all users with a valid location and clerk_id
        const { data: users, error: userError } = await supabase
            .from("users")
            .select("id, clerk_id, location")
            .not("location", "is", null)
            .not("clerk_id", "is", null);

        if (userError) {
            console.error("Error fetching users:", JSON.stringify(userError, null, 2));
            return new NextResponse("Failed to fetch users", { status: 500 });
        }

        if (!users || users.length === 0) {
            return new NextResponse("No users with locations found", { status: 200 });
        }

        const today = new Date().toISOString().split("T")[0];

        let successCount = 0;
        let errorCount = 0;
        let notificationCount = 0;
        let emailCount = 0;
        let friendNotificationCount = 0;

        for (const user of users) {
            const wkbHex = user.location as string;
            const geometry = wkx.Geometry.parse(Buffer.from(wkbHex, "hex"));
            const userLocation = geometry.toGeoJSON() as { type: string; coordinates: number[] };
            const [longitude, latitude] = userLocation.coordinates || [0, 0];

            try {
                // Fetch weather from OpenWeatherMap
                const weatherResponse = await fetch(
                    `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
                );

                if (!weatherResponse.ok) {
                    throw new Error(`HTTP error: ${weatherResponse.statusText}`);
                }

                const weatherData = await weatherResponse.json();

                const temperature = weatherData.main.temp;
                const weatherCondition = weatherData.weather[0]?.main || "Unknown";
                const humidity = weatherData.main.humidity;
                const windSpeed = weatherData.wind.speed;

                // Upsert weather data
                const { error: weatherError } = await supabase
                    .from("daily_weather")
                    .upsert(
                        {
                            user_id: user.id,
                            date: today,
                            latitude,
                            longitude,
                            temperature,
                            weather_condition: weatherCondition,
                            humidity,
                            wind_speed: windSpeed,
                        },
                        { onConflict: "user_id,date" }
                    );

                if (weatherError) {
                    throw new Error(`Database error: ${weatherError.message}`);
                }

                // Check for severe weather
                const severeConditions = ["Thunderstorm", "Tornado", "Snow", "Hurricane"];
                const isSevere =
                    temperature < -5 ||
                    temperature > 35 ||
                    windSpeed > 15 ||
                    severeConditions.includes(weatherCondition);

                if (isSevere) {
                    // Create notification for the user
                    const notificationContent = `Severe weather alert: ${weatherCondition} with temperature ${temperature}°C and wind speed ${windSpeed} m/s.`;
                    const { error: notificationError } = await supabase
                        .from("notifications")
                        .insert({
                            user_id: user.id,
                            content: notificationContent,
                        });

                    if (notificationError) {
                        console.error(`Error creating notification for user ${user.id}:`, JSON.stringify(notificationError, null, 2));
                    } else {
                        notificationCount++;
                    }

                    const { data: friends, error: friendsError } = await supabase
                        .from("friends")
                        .select("friend_id, users!friends_friend_id_fkey(clerk_id)")
                        .eq("user_id", user.id)
                        .eq("status", "accepted");

                    if (friendsError) {
                        console.error(`Error fetching friends for user ${user.id}:`, JSON.stringify(friendsError, null, 2));
                    } else if (friends.length > 0) {
                        const friendNotifications = friends.map(friend => ({
                            user_id: friend.friend_id,
                            content: `${user.clerk_id} has a severe weather alert: ${weatherCondition} in their area.`,
                        }));

                        const { error: friendNotifyError } = await supabase
                            .from("notifications")
                            .insert(friendNotifications);

                        if (friendNotifyError) {
                            console.error(`Error creating friend notifications for user ${user.id}:`, JSON.stringify(friendNotifyError, null, 2));
                        } else {
                            friendNotificationCount += friendNotifications.length;
                        }
                    }

                    // Fetch user's email from Clerk
                    let email: string | undefined;
                    try {
                        const client = (await clerkClient())
                        const clerkUser = await client.users.getUser(user.clerk_id);
                        email = clerkUser.primaryEmailAddress?.emailAddress;
                    } catch (clerkError) {
                        console.warn(`Error fetching Clerk user ${user.clerk_id}:`, clerkError);
                    }

                    if (email) {
                        const emailResponse = await sendEmail(
                            email,
                            "Severe Weather Warning",
                            `<p>Dear user,</p><p>We detected severe weather in your area: <strong>${weatherCondition}</strong> with a temperature of <strong>${temperature}°C</strong> and wind speed of <strong>${windSpeed} m/s</strong>.</p><p>Please take precautions to protect your garden.</p><p>Best,<br>Your Gardening App</p>`
                        );

                        if (!emailResponse.ok) {
                            console.error(`Error sending email to ${email}:`, await emailResponse.text());
                        } else {
                            emailCount++;
                        }
                    } else {
                        console.warn(`No email found for user ${user.id}`);
                    }
                }

                successCount++;
            } catch (error: any) {
                console.error(`Error processing weather for user ${user.id}:`, error.message);
                errorCount++;
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        return NextResponse.json(
            {
                message: "Weather data update completed",
                users_processed: users.length,
                successful: successCount,
                failed: errorCount,
                notifications_sent: notificationCount,
                friend_notifications_sent: friendNotificationCount,
                emails_sent: emailCount,
            },
            { status: 200 }
        );
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}