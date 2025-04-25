// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";
// import { clerkClient } from "@clerk/nextjs/server";


// const sendEmail = async (email: string, subject: string, message: string) => {
//     const res = await fetch("https://api.resend.com/emails", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//         },
//         body: JSON.stringify({
//             from: "onboarding@resend.dev",
//             to: email,
//             subject: subject,
//             html: message,
//         }),
//     });
//     return res;
// };


// // OpenWeatherMap API key (store in environment variables)
// const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
// const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

// export async function GET(request: NextRequest) {
//     try {
//         // Secure the endpoint with a secret token
//         const authHeader = request.headers.get("authorization");
//         if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         if (!OPENWEATHER_API_KEY) {
//             return new NextResponse("Missing OpenWeatherMap API key", { status: 500 });
//         }

//         if (!process.env.SENDGRID_API_KEY) {
//             return new NextResponse("Missing SendGrid API key", { status: 500 });
//         }

//         const supabase = await createClient();

//         // Fetch all users with a valid location and clerk_id
//         const { data: users, error: userError } = await supabase
//             .from("users")
//             .select("id, clerk_id, location")
//             .not("location", "is", null)
//             .not("clerk_id", "is", null);

//         if (userError) {
//             console.error("Error fetching users:", userError);
//             return new NextResponse("Failed to fetch users", { status: 500 });
//         }

//         if (!users || users.length === 0) {
//             return new NextResponse("No users with locations found", { status: 200 });
//         }

//         const today = new Date().toISOString().split("T")[0]; // e.g., "2025-04-24"

//         // Skim through users and fetch weather for each location
//         let successCount = 0;
//         let errorCount = 0;
//         let notificationCount = 0;

//         for (const user of users) {
//             // Extract latitude and longitude from the geography type
//             const location = user.location as { type: string; coordinates: number[] };
//             if (!location || location.type !== "Point" || !location.coordinates) {
//                 console.warn(`Invalid location for user ${user.id}`);
//                 errorCount++;
//                 continue;
//             }

//             const [longitude, latitude] = location.coordinates;

//             try {
//                 // Fetch weather from OpenWeatherMap
//                 const weatherResponse = await fetch(
//                     `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
//                 );

//                 if (!weatherResponse.ok) {
//                     throw new Error(`HTTP error: ${weatherResponse.statusText}`);
//                 }

//                 const weatherData = await weatherResponse.json();

//                 const temperature = weatherData.main.temp; // in Celsius
//                 const weatherCondition = weatherData.weather[0]?.main || "Unknown"; // e.g., "Rain", "Sunny"
//                 const humidity = weatherData.main.humidity; // percentage
//                 const windSpeed = weatherData.wind.speed; // m/s

//                 // Upsert weather data
//                 const { error: weatherError } = await supabase
//                     .from("daily_weather")
//                     .upsert(
//                         {
//                             user_id: user.id,
//                             date: today,
//                             latitude,
//                             longitude,
//                             temperature,
//                             weather_condition: weatherCondition,
//                             humidity,
//                             wind_speed: windSpeed,
//                         },
//                         { onConflict: "user_id,date" }
//                     );

//                 if (weatherError) {
//                     throw new Error(`Database error: ${weatherError.message}`);
//                 }

//                 // Check for severe weather
//                 const severeConditions = [
//                     "Thunderstorm",
//                     "Tornado",
//                     "Snow",
//                     "Hurricane",
//                 ];
//                 const isSevere =
//                     temperature < -5 || // Freezing
//                     temperature > 35 || // Extreme heat
//                     windSpeed > 15 || // Stormy winds (~54 km/h)
//                     severeConditions.includes(weatherCondition);

//                 if (isSevere) {
//                     // Create notification
//                     const { error: notificationError } = await supabase
//                         .from("notifications")
//                         .insert({
//                             user_id: user.id,
//                             content: `Severe weather alert: ${weatherCondition} with temperature ${temperature}°C and wind speed ${windSpeed} m/s.`,
//                             type: "weather_warning",
//                         });

//                     if (notificationError) {
//                         console.error(`Error creating notification for user ${user.id}:`, notificationError);
//                     } else {
//                         notificationCount++;
//                     }

//                     // Fetch user's email from Clerk
//                     const clerkUser = clerkClient.
//                     const email = clerkUser.primaryEmailAddress?.emailAddress;

//                     if (email) {
//                         // Send email
//                         const msg = {
//                             to: email,
//                             from: "noreply@yourapp.com", // Replace with your verified sender
//                             subject: "Severe Weather Warning",
//                             text: `Dear user,\n\nWe detected severe weather in your area: ${weatherCondition} with a temperature of ${temperature}°C and wind speed of ${windSpeed} m/s.\n\nPlease take precautions to protect your garden.\n\nBest,\nYour Gardening App`,
//                             html: `<p>Dear user,</p><p>We detected severe weather in your area: <strong>${weatherCondition}</strong> with a temperature of <strong>${temperature}°C</strong> and wind speed of <strong>${windSpeed} m/s</strong>.</p><p>Please take precautions to protect your garden.</p><p>Best,<br>Your Gardening App</p>`,
//                         };

//                         await sgMail.send(msg).catch((emailError) => {
//                             console.error(`Error sending email to ${email}:`, emailError);
//                         });
//                     } else {
//                         console.warn(`No email found for user ${user.id}`);
//                     }
//                 }

//                 successCount++;
//             } catch (error: any) {
//                 console.error(`Error processing weather for user ${user.id}:`, error.message);
//                 errorCount++;
//                 // Delay to avoid rate limiting
//                 await new Promise((resolve) => setTimeout(resolve, 1000));
//             }
//         }

//         return NextResponse.json(
//             {
//                 message: "Weather data update completed",
//                 users_processed: users.length,
//                 successful: successCount,
//                 failed: errorCount,
//                 notifications_sent: notificationCount,
//             },
//             { status: 200 }
//         );
//     } catch (e: any) {
//         console.error("Server error:", e);
//         return NextResponse.json({ error: e.message }, { status: 500 });
//     }
// }