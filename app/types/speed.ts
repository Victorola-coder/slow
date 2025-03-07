export interface SpeedTestResult {
    downloadSpeed: number | null;
    uploadSpeed: number | null;
    ping: number | null;
    timestamp?: Date;
}

// For API responses
export interface AverageSpeedData {
    provider: string;
    averageDownload: number;
    averageUpload: number;
    averagePing: number;
    samples: number;
    lastUpdated?: Date;
}

// Network information types
export interface NetworkLocation {
    city: string | null;
    region: string | null;
    country: string | null;
    loc?: string;
}

export interface NetworkInfo {
    ip: string;
    provider: string;
    location: NetworkLocation;
} 