import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIP || "127.0.0.1";

    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);

    if (!geoResponse.ok) {
      throw new Error(`Failed to fetch IP data: ${geoResponse.statusText}`);
    }

    const geoData = await geoResponse.json();

    // Check for API error response
    if (geoData.error) {
      throw new Error(geoData.reason || "API Error");
    }

    return NextResponse.json({
      ip,
      location: {
        country: geoData.country_name || "Unknown",
        region: geoData.region || "Unknown",
        city: geoData.city || "Unknown",
      },
      isp: geoData.org || "Unknown ISP",
      regionalSpeeds: {
        averageDownload: 100,
        averageUpload: 50,
        averagePing: 20,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch network information" },
      { status: 500 }
    );
  }
}
