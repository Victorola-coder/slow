"use client";

import { Button } from "./ui";
import { useState } from "react";
import { motion } from "framer-motion";
import NetworkInfo from "./NetworkInfo";
import { API_ENDPOINTS, TEST_FILE_SIZES } from "@/app/constants";

export default function SpeedTest() {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);

  const testSpeed = async () => {
    setTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);

    // Test ping first
    const pingStart = Date.now();
    try {
      await fetch(API_ENDPOINTS.ping);
      const pingTime = Date.now() - pingStart;
      setPing(pingTime);
    } catch (error) {
      console.error("Ping test failed:", error);
    }

    // Download speed test
    try {
      const start = Date.now();
      const response = await fetch(API_ENDPOINTS.downloadTest);
      const data = await response.blob();
      const duration = (Date.now() - start) / 1000; // seconds
      const fileSizeInBits = data.size * 8;
      const speedMbps = fileSizeInBits / duration / 1_000_000;
      setDownloadSpeed(Math.round(speedMbps));
    } catch (error) {
      console.error("Download test failed:", error);
    }

    // Upload speed test
    try {
      const testData = new Blob([new ArrayBuffer(TEST_FILE_SIZES.small)]); // 1MB test file
      const start = Date.now();
      await fetch(API_ENDPOINTS.uploadTest, {
        method: "POST",
        body: testData,
      });
      const duration = (Date.now() - start) / 1000;
      const fileSizeInBits = testData.size * 8;
      const speedMbps = fileSizeInBits / duration / 1_000_000;
      setUploadSpeed(Math.round(speedMbps));
    } catch (error) {
      console.error("Upload test failed:", error);
    }

    setTesting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-8">SpeedPulse</h1>

        {!testing && !downloadSpeed && (
          <Button onClick={testSpeed} size="lg" className="mb-8">
            Start Speed Test
          </Button>
        )}

        {testing && (
          <div className="mb-8">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xl">Testing your connection...</p>
          </div>
        )}

        {downloadSpeed !== null && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl mb-2">Download Speed</h2>
              <p className="text-5xl font-bold text-primary">
                {downloadSpeed} Mbps
              </p>
            </div>

            {uploadSpeed !== null && (
              <div className="text-center">
                <h2 className="text-2xl mb-2">Upload Speed</h2>
                <p className="text-5xl font-bold text-primary">
                  {uploadSpeed} Mbps
                </p>
              </div>
            )}

            {ping !== null && (
              <div className="text-center">
                <h2 className="text-2xl mb-2">Ping</h2>
                <p className="text-5xl font-bold text-primary">{ping} ms</p>
              </div>
            )}

            <Button onClick={testSpeed} variant="secondary" className="mt-8">
              Test Again
            </Button>
          </div>
        )}

        {downloadSpeed !== null && (
          <div className="mt-8">
            <NetworkInfo />
          </div>
        )}
      </motion.div>
    </div>
  );
}
