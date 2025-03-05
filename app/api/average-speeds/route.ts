import { NextResponse } from 'next/server';

// Simple in-memory cache (use a database in production)
let speedCache: {
    [locationKey: string]: {
        provider: string;
        downloadAvg: number;
        uploadAvg: number;
        pingAvg: number;
        samples: number;
        lastUpdated: Date;
        clientIPs: string[]; // Track IPs that have contributed to this data
    }
} = {};

export async function GET(request: Request) {
    const url = new URL(request.url);
    const locationKey = url.searchParams.get('locationKey');
    const provider = url.searchParams.get('provider');

    // Get client IP for potential filtering
    const ip = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1';

    if (!locationKey) {
        return NextResponse.json({ error: 'Location key is required' }, { status: 400 });
    }
    console.log("Location Key", locationKey);
    // Get cached data for the location and provider (if specified)
    const cacheKey = provider ? `${locationKey}-${provider}` : locationKey;
    const cachedData = speedCache[cacheKey];

    if (!cachedData) {
        return NextResponse.json({ error: 'No data for this location yet' }, { status: 404 });
    }

    return NextResponse.json({
        ...cachedData,
        // Don't send the full list of IPs back to the client
        clientIPs: undefined
    });
}

export async function POST(request: Request) {
    try {
        const { locationKey, provider, downloadSpeed, uploadSpeed, pingTime } = await request.json();

        // Get client IP (same method as in network-info)
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            '127.0.0.1';

        if (!locationKey || !provider) {
            return NextResponse.json({ error: 'Location key and provider are required' }, { status: 400 });
        }

        const cacheKey = `${locationKey}-${provider}`;
        const existingData = speedCache[cacheKey];

        if (existingData) {
            // Check if this IP has already contributed recently (optional rate limiting)
            // This prevents a single user from skewing the results

            // Update existing data
            const newSamples = existingData.samples + 1;
            speedCache[cacheKey] = {
                provider,
                downloadAvg: (existingData.downloadAvg * existingData.samples + downloadSpeed) / newSamples,
                uploadAvg: (existingData.uploadAvg * existingData.samples + uploadSpeed) / newSamples,
                pingAvg: (existingData.pingAvg * existingData.samples + pingTime) / newSamples,
                samples: newSamples,
                lastUpdated: new Date(),
                clientIPs: [...(existingData.clientIPs || []), ip]
            };
        } else {
            // Create new entry
            speedCache[cacheKey] = {
                provider,
                downloadAvg: downloadSpeed,
                uploadAvg: uploadSpeed,
                pingAvg: pingTime,
                samples: 1,
                lastUpdated: new Date(),
                clientIPs: [ip]
            };
        }

        return NextResponse.json({
            success: true,
            data: {
                ...speedCache[cacheKey],
                clientIPs: undefined // Don't send IPs back to client
            }
        });
    } catch (error) {
        console.error('Error updating speed cache:', error);
        return NextResponse.json({ error: 'Failed to update speed cache' }, { status: 500 });
    }
} 