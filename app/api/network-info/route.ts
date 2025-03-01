import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip");

    // Call IP geolocation API (you'll need to sign up for a service like ipapi.co)
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();

    // You would typically get this from your database
    const regionalSpeeds = {
      averageDownload: 100,
      averageUpload: 50,
      averagePing: 20,
    };

    return NextResponse.json({
      ip,
      location: {
        country: geoData.country_name,
        region: geoData.region,
        city: geoData.city,
      },
      isp: geoData.org,
      regionalSpeeds,
    });
  } catch (error) {
    console.error("Error fetching network info:", error);
    return NextResponse.json(
      { error: "Failed to fetch network information" },
      { status: 500 }
    );
  }
}
