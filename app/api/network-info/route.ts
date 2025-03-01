import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get client IP from request headers
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIP || "127.0.0.1";

    // Get timezone-based location
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [continent, ...locationParts] = timezone.split("/");
    const location = locationParts.join(", ").replace(/_/g, " ");

    return NextResponse.json({
      ip,
      location: {
        country: continent || "Unknown",
        region: location || "Unknown",
        city: "Unknown",
      },
      isp: "Local Network",
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
