"use client";

import { toast } from "sonner";
import { Button } from "./ui";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { formatSpeed, formatPing } from "@/app/lib/speedTest";
import { API_ENDPOINTS, TEST_FILE_SIZES, PING_INTERVAL } from "@/app/constants";

export default function SpeedTest() {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [averageSpeedData, setAverageSpeedData] =
    useState<AverageSpeedData | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [testPhase, setTestPhase] = useState<
    "idle" | "ping" | "download" | "upload"
  >("idle");

  // Fetch network info on component mount
  useEffect(() => {
    const getNetworkInfo = async () => {
      try {
        const response = await fetch("/api/network-info");
        if (response.ok) {
          const data = await response.json();
          console.log("Network info response:", data); // For debugging
          setNetworkInfo(data);

          // Once we have network info, fetch average speeds for this location
          const locationKey = `${data.location.city || "unknown"}-${
            data.location.region || "unknown"
          }-${data.location.country || "unknown"}`;
          fetchAverageSpeedData(locationKey, data.provider);
        }
      } catch (error) {
        console.error("Error fetching network info:", error);
      }
    };

    getNetworkInfo();
  }, []);

  const fetchAverageSpeedData = async (
    locationKey: string,
    provider: string
  ) => {
    try {
      const response = await fetch(
        `/api/average-speeds?locationKey=${locationKey}&provider=${provider}`
      );
      if (response.ok) {
        const data = await response.json();
        setAverageSpeedData(data);
      }
    } catch (error) {
      console.error("Error fetching average speed data:", error);
    }
  };

  const updateAverageSpeedData = async (
    downloadSpeed: number,
    uploadSpeed: number,
    pingTime: number
  ) => {
    if (!networkInfo) return;

    try {
      const locationKey = `${networkInfo.location.city}-${networkInfo.location.region}-${networkInfo.location.country}`;
      await fetch("/api/average-speeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationKey,
          provider: networkInfo.provider,
          downloadSpeed,
          uploadSpeed,
          pingTime,
        }),
      });
    } catch (error) {
      console.error("Error updating average speed data:", error);
    }
  };

  const testSpeed = async () => {
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

    // Test ping first
    setTestPhase("ping");
    const startTime = Date.now();
    try {
      const response = await fetch("/api/ping");
      const endTime = Date.now();
      const latency = endTime - startTime;
      setPing(latency);
    } catch (error) {
      console.error("Ping test failed:", error);
    }

    // Ensure we wait at least PING_INTERVAL between tests for more accurate results
    setTimeout(async () => {
      // Download speed test
      setTestPhase("download");
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
      setTestPhase("upload");
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

        // After all tests are complete, update the average speed data
        if (ping !== null) {
          updateAverageSpeedData(speedMbps, speedMbps, ping);
        }
      } catch (error) {
        console.error("Upload test failed:", error);
      }

      clearInterval(progressInterval);
      setTestProgress(100);
      setTesting(false);
    }, PING_INTERVAL);
  };

  // Function to get appropriate label for test phase
  const getTestPhaseLabel = () => {
    switch (testPhase) {
      case "ping":
        return "Testing ping...";
      case "download":
        return "Testing download...";
      case "upload":
        return "Testing upload...";
      default:
        return "Preparing test...";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("IP address copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy IP address");
      console.error("Failed to copy:", err);
    }
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
            <div className="relative w-40 h-40 mx-auto">
              {/* Circular progress indicator */}
              <div className="w-full h-full rounded-full absolute">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-700 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="text-blue-500 stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (testProgress / 100) * 251.2}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>

              {/* Percentage display in the center */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-3xl font-bold">{testProgress}%</div>
                <div className="text-sm text-gray-400">
                  {getTestPhaseLabel()}
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              This may take 15-30 seconds depending on your connection
            </p>
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
                  {uploadSpeed ? formatSpeed(uploadSpeed) : "---"}
                </div>
              </div>

              {/* Ping */}
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="text-gray-400 mb-2">Ping</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {ping ? formatPing(ping) : "---"}
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

      {/* Network Info and Average Speeds Section */}
      {(networkInfo || averageSpeedData) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 backdrop-blur-sm bg-black/20 rounded-3xl p-6 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Network Information */}
          {networkInfo && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Your Network
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-400 w-24">Provider:</span>
                  <span className="text-white capitalize">
                    {networkInfo.provider
                      ?.toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                      "Unknown Provider"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-24">Location:</span>
                  <span className="text-white">
                    {networkInfo.location && networkInfo.location.city
                      ? networkInfo.location.city
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-24">IP Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{networkInfo.ip}</span>
                    <button
                      onClick={() => copyToClipboard(networkInfo.ip)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors"
                      title="Copy IP address"
                    >
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Average Speeds */}
          {averageSpeedData && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Average Speeds in Your Area
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-400 w-32">Download:</span>
                  <span className="text-white">
                    {formatSpeed(averageSpeedData.downloadAvg)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-32">Upload:</span>
                  <span className="text-white">
                    {formatSpeed(averageSpeedData.uploadAvg)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-32">Ping:</span>
                  <span className="text-white">
                    {formatPing(averageSpeedData.pingAvg)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Based on {averageSpeedData.samples}{" "}
                  {averageSpeedData.samples === 1 ? "test" : "tests"} from users
                  with {averageSpeedData.provider}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
