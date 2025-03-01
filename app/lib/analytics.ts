import { SpeedTestResult } from "../types/speed";

export const trackSpeedTest = (result: SpeedTestResult) => {
  // Implement your analytics tracking here
  // Example with Google Analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "speed_test", {
      download_speed: result.downloadSpeed,
      upload_speed: result.uploadSpeed,
      ping: result.ping,
    });
  }
};
