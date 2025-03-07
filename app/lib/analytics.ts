import { SpeedTestResult } from "../types/speed";

export const trackSpeedTest = (result: SpeedTestResult) => {
  // Implement your analytics tracking here
  console.log("Tracking pulse test result:", result);
  // Example: Send to analytics service
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'pulse_test_completed', {
      'download_speed': result.downloadSpeed,
      'upload_speed': result.uploadSpeed,
      'ping': result.ping,
      'timestamp': new Date().toISOString()
    });
  }
};
