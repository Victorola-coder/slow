import { NextResponse } from "next/server";

// For development/testing only
const mockIP = "105.112.201.144"; // Use this for consistent testing
const mockLocationData = {
  city: "Lagos",
  region: "Lagos",
  country: "NG",
  loc: "6.4550,3.3841"
};

export async function GET(request: Request) {
  try {
    // Use real IP extraction in production, mock in development
    const ip = process.env.NODE_ENV === 'production'
      ? (request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1')
      : mockIP;

    console.log("Extracted IP is:", ip); // For debugging

    // In development, use mock data to ensure consistent testing
    let locationData;
    let providerData;
    let timezoneData;
    console.log("NODE_ENV is:", process.env.NODE_ENV);

    if (process.env.NODE_ENV === 'production') {
      // Use a service like ipinfo.io or ip-api.com to get network and location info
      // You'll need to sign up for an API key for production use
      const response = await fetch(`https://ipinfo.io/${ip}?token=35117ab1de15de`);
      const data = await response.json();
      console.log(data);

      locationData = {
        city: data.city,
        region: data.region,
        country: data.country,
        loc: data.loc
      };

      // Extract provider name from org field, removing the AS number prefix
      providerData = data.org ? data.org.replace(/^AS\d+\s+/, '') : 'Unknown Provider';
      timezoneData = data.timezone;

      console.log("Data", data);
    } else {
      // Use mock data in development
      locationData = mockLocationData;
      providerData = "Test ISP Provider";
      timezoneData = "Africa/Lagos";
    }

    return NextResponse.json({
      ip,
      provider: providerData,
      location: locationData,
      timezone: timezoneData
    });
  } catch (error) {
    console.error('Error getting network info:', error);
    return NextResponse.json({ error: 'Failed to get network info' }, { status: 500 });
  }
}
