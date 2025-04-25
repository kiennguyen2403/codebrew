import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// OpenWeatherMap API key (store in environment variables)
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: NextRequest) {
    try {
        // Secure the endpoint with a secret token
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!OPENWEATHER_API_KEY) {
            return new NextResponse("Missing OpenWeatherMap API key", { status: 500 });
        }

        const supabase = await createClient();

        // Fetch all users with a valid location
        const { data: users, error: userError } = await supabase
            .from("users")
            .select("id, location")
            .not("location", "is", null);

        if (userError) {
            console.error("Error fetching users:", userError);
            return new NextResponse("Failed to fetch users", { status: 500 });
        }

        if (!users || users.length === 0) {
            return new NextResponse("No users with locations found", { status: 200 });
        }

        const today = new Date().toISOString().split("T")[0]; // e.g., "2025-04-24"

        // Skim through users and fetch weather for each location
        let successCount = 0;
        let errorCount = 0;

        for (const user of users) {
            // Extract latitude and longitude from the geography type
            const location = user.location as { type: string; coordinates: number[] };
            if (!location || location.type !== "Point" || !location.coordinates) {
                console.warn(`Invalid location for user ${user.id}`);
                errorCount++;
                continue;
            }

            const [longitude, latitude] = location.coordinates;

            try {
                // Fetch weather from OpenWeatherMap
                const weatherResponse = await fetch(
                    `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
                );

                if (!weatherResponse.ok) {
                    throw new Error(`HTTP error: ${weatherResponse.statusText}`);
                }

                const weatherData = await weatherResponse.json();

                const temperature = weatherData.main.temp; // in Celsius
                const weatherCondition = weatherData.weather[0]?.main || "Unknown"; // e.g., "Rain", "Sunny"
                const humidity = weatherData.main.humidity; // percentage
                const windSpeed = weatherData.wind.speed; // m/s

                // Upsert weather data (update if exists, insert if not)
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

                successCount++;
            } catch (error: any) {
                console.error(`Error processing weather for user ${user.id}:`, error.message);
                errorCount++;
                // Add a small delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
            }
        }

        return NextResponse.json(
            {
                message: "Weather data update completed",
                users_processed: users.length,
                successful: successCount,
                failed: errorCount,
            },
            { status: 200 }
        );
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}