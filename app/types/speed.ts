export interface SpeedTestResult {
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  ping: number | null;
  timestamp: Date;
}

export interface NetworkInfoData {
  ip: string;
  location: {
    country: string;
    region: string;
    city: string;
  };
  isp: string;
  regionalSpeeds: {
    averageDownload: number;
    averageUpload: number;
    averagePing: number;
  };
}
