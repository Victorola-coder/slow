"use client";

import { Card } from "./ui";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../constants";

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
        const response = await fetch(API_ENDPOINTS.networkInfo);
        const data = await response.json();
        setNetworkInfo(data);
      } catch (error) {
        console.error("Failed to fetch network info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNetworkInfo();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-700/50 rounded-lg"></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-white/10"
    >
      {loading ? (
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded animate-pulse" />
          <div className="h-24 bg-white/5 rounded animate-pulse" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Network Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Your Network
              </h3>
              <div className="space-y-2">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm">IP Address</p>
                  <p className="text-lg font-medium">{networkInfo?.ip}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-lg font-medium">
                    {networkInfo?.location.city}, {networkInfo?.location.region}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm">ISP</p>
                  <p className="text-lg font-medium">{networkInfo?.isp}</p>
                </div>
              </div>
            </div>

            {/* Regional Speeds */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Regional Averages
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">Download</p>
                    <p className="text-lg font-medium">
                      {networkInfo?.regionalSpeeds.averageDownload} Mbps
                    </p>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{
                        width: `${(networkInfo?.regionalSpeeds.averageDownload || 0) / 2}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">Upload</p>
                    <p className="text-lg font-medium">
                      {networkInfo?.regionalSpeeds.averageUpload} Mbps
                    </p>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{
                        width: `${(networkInfo?.regionalSpeeds.averageUpload || 0) / 2}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
