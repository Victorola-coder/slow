"use client";

import { Button } from "./ui";
import { useState } from "react";
import { motion } from "framer-motion";
import NetworkInfo from "./NetworkInfo";
import { API_ENDPOINTS, TEST_FILE_SIZES } from "@/app/constants";
import { formatSpeed, formatPing } from '@/app/lib/speedTest';
import { toast } from 'sonner';

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
    <div className="relative">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-blue-500/10 blur-3xl -z-10" />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-white/10"
      >
        {!testing && !downloadSpeed && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Test Your Internet Speed
            </h2>
            <Button
              onClick={testSpeed}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full transform transition hover:scale-105"
            >
              Start Test
            </Button>
          </div>
        )}

        {testing && (
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-black rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xl font-semibold">Testing...</div>
              </div>
            </div>
            <p className="text-gray-400">Measuring your connection speed</p>
          </div>
        )}

        {downloadSpeed !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Download Speed */}
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="text-gray-400 mb-2">Download</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {formatSpeed(downloadSpeed)}
                </div>
              </div>

              {/* Upload Speed */}
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="text-gray-400 mb-2">Upload</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {uploadSpeed ? formatSpeed(uploadSpeed) : '---'}
                </div>
              </div>

              {/* Ping */}
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="text-gray-400 mb-2">Ping</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {ping ? formatPing(ping) : '---'}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={testSpeed}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full transform transition hover:scale-105 border border-white/10"
              >
                Test Again
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
