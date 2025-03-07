import { useState, useCallback } from "react";
import { API_ENDPOINTS, TEST_FILE_SIZES, PING_INTERVAL } from "@/app/constants";

interface SpeedTestResult {
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  ping: number | null;
}

interface UseSpeedTestReturn {
  testing: boolean;
  testProgress: number;
  testPhase: "idle" | "ping" | "download" | "upload";
  result: SpeedTestResult;
  startTest: () => Promise<SpeedTestResult>;
  updateAverageSpeedData: (
    locationKey: string,
    provider: string,
    result: SpeedTestResult
  ) => Promise<void>;
}

export function useSpeedTest(): UseSpeedTestReturn {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [testPhase, setTestPhase] = useState<
    "idle" | "ping" | "download" | "upload"
  >("idle");

  const updateAverageSpeedData = async (
    locationKey: string,
    provider: string,
    result: SpeedTestResult
  ) => {
    try {
      await fetch("/api/average-speeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationKey,
          provider,
          downloadSpeed: result.downloadSpeed,
          uploadSpeed: result.uploadSpeed,
          pingTime: result.ping,
        }),
      });
    } catch (error) {
      console.error("Error updating average speed data:", error);
    }
  };

  const startTest = useCallback(async (): Promise<SpeedTestResult> => {
    setTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setTestPhase("ping");
    setTestProgress(0);

    // Start progress animation
    const progressInterval = setInterval(() => {
      setTestProgress((prev) => {
        const newProgress = prev + 1;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, 300); // Increment progress every 300ms

    try {
      // Test ping first
      setTestPhase("ping");
      const pingResult = await testPing();
      setPing(pingResult);

      // Ensure we wait at least PING_INTERVAL between tests for more accurate results
      await new Promise((resolve) => setTimeout(resolve, PING_INTERVAL));

      // Download speed test
      setTestPhase("download");
      const downloadResult = await testDownloadSpeed();
      setDownloadSpeed(downloadResult);

      // Upload speed test
      setTestPhase("upload");
      const uploadResult = await testUploadSpeed();
      setUploadSpeed(uploadResult);

      const result = {
        downloadSpeed: downloadResult,
        uploadSpeed: uploadResult,
        ping: pingResult,
      };

      return result;
    } catch (error) {
      console.error("Speed test failed:", error);
      return { downloadSpeed: null, uploadSpeed: null, ping: null };
    } finally {
      clearInterval(progressInterval);
      setTesting(false);
      setTestPhase("idle");
      setTestProgress(100);
    }
  }, []);

  const testPing = async (): Promise<number> => {
    try {
      const startTime = Date.now();
      await fetch("/api/ping");
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.error("Ping test failed:", error);
      return 0;
    }
  };

  const testDownloadSpeed = async (): Promise<number> => {
    try {
      const start = Date.now();
      const response = await fetch(API_ENDPOINTS.downloadTest);
      const data = await response.blob();
      const duration = (Date.now() - start) / 1000; // seconds
      const fileSizeInBits = data.size * 8;
      return Math.round(fileSizeInBits / duration / 1_000_000); // Mbps
    } catch (error) {
      console.error("Download test failed:", error);
      return 0;
    }
  };

  const testUploadSpeed = async (): Promise<number> => {
    try {
      const testData = new Blob([new ArrayBuffer(TEST_FILE_SIZES.small)]); // 1MB test file
      const start = Date.now();
      await fetch(API_ENDPOINTS.uploadTest, {
        method: "POST",
        body: testData,
      });
      const duration = (Date.now() - start) / 1000;
      const fileSizeInBits = testData.size * 8;
      return Math.round(fileSizeInBits / duration / 1_000_000); // Mbps
    } catch (error) {
      console.error("Upload test failed:", error);
      return 0;
    }
  };

  return {
    testing,
    testProgress,
    testPhase,
    result: { downloadSpeed, uploadSpeed, ping },
    startTest,
    updateAverageSpeedData,
  };
}
