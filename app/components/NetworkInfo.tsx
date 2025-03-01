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
      transition={{ duration: 0.5 }}
    >
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Network Info</h3>
            <p className="text-gray-400">IP Address: {networkInfo?.ip}</p>
            <p className="text-gray-400">
              Location: {networkInfo?.location.city},{" "}
              {networkInfo?.location.region}
            </p>
            <p className="text-gray-400">ISP: {networkInfo?.isp}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Regional Average Speeds
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Download</p>
                <p className="text-xl font-bold">
                  {networkInfo?.regionalSpeeds.averageDownload} Mbps
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Upload</p>
                <p className="text-xl font-bold">
                  {networkInfo?.regionalSpeeds.averageUpload} Mbps
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Ping</p>
                <p className="text-xl font-bold">
                  {networkInfo?.regionalSpeeds.averagePing} ms
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
