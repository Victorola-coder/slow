"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../constants";
import { getNetworkInfo } from "../lib/networkInfo";

interface NetworkInfoData {
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

export default function NetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNetworkInfo() {
      try {
        // Use our native implementation instead of API
        const info = await getNetworkInfo();
        setNetworkInfo(info);
      } catch (error) {
        console.error("Failed to fetch network info:", error);
        // Fallback to API endpoint if native method fails
        try {
          const response = await fetch(API_ENDPOINTS.networkInfo);
          const data = await response.json();
          setNetworkInfo(data);
        } catch (apiError) {
          console.error("API fallback failed:", apiError);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNetworkInfo();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded animate-pulse" />
          <div className="h-24 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded animate-pulse" />
          <div className="h-24 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const locationText = networkInfo?.location
    ? `${networkInfo.location.region || "Unknown"}`
    : "Location unavailable";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
      {/* Left Column - Network Info */}
      <div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Your Network
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-black/30">
            <p className="text-gray-400 text-sm">IP Address</p>
            <p className="text-lg font-medium">
              {networkInfo?.ip || "Unknown"}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-black/30">
            <p className="text-gray-400 text-sm">Location</p>
            <p className="text-lg font-medium">{locationText}</p>
          </div>
          <div className="p-4 rounded-lg bg-black/30">
            <p className="text-gray-400 text-sm">Connection Type</p>
            <p className="text-lg font-medium">
              {networkInfo?.isp || "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Connection Speeds */}
      <div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Estimated Speeds
        </h2>
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-black/30">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Download</span>
              <span className="font-medium">
                {networkInfo?.regionalSpeeds?.averageDownload || 0} Mbps
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((networkInfo?.regionalSpeeds?.averageDownload || 0) /
                      200) *
                    100
                  }%`,
                }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-black/30">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Upload</span>
              <span className="font-medium">
                {networkInfo?.regionalSpeeds?.averageUpload || 0} Mbps
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((networkInfo?.regionalSpeeds?.averageUpload || 0) / 100) *
                    100
                  }%`,
                }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-black/30">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Ping</span>
              <span className="font-medium">
                {networkInfo?.regionalSpeeds?.averagePing || 0} ms
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((networkInfo?.regionalSpeeds?.averagePing || 0) / 100) *
                    100
                  }%`,
                }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
