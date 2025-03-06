"use client";

import { motion } from "framer-motion";
import { RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";
import { useNetworkInfo } from "@/app/lib/hooks";

export default function NetworkInfo() {
  const { networkInfo, loading, refreshing, refreshNetworkInfo } =
    useNetworkInfo();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Failed to copy:", err);
    }
  };

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Your Network
          </h2>
          <button
            onClick={refreshNetworkInfo}
            disabled={refreshing}
            className="p-2 rounded-lg bg-black/30 hover:bg-black/40 transition-colors"
            aria-label="Refresh network information"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-400 ${
                refreshing ? "animate-spin" : "hover:text-white"
              }`}
            />
          </button>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-black/30">
            <div className="text-sm text-gray-400 mb-1">
              Internet Service Provider
            </div>
            <div className="text-lg font-medium text-white">
              {networkInfo?.provider || "Unknown Provider"}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black/30">
            <div className="text-sm text-gray-400 mb-1">Location</div>
            <div className="text-lg font-medium text-white">
              {networkInfo?.location?.city || "Unknown"}, {locationText}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black/30">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400 mb-1">IP Address</div>
              <button
                onClick={() =>
                  networkInfo?.ip && copyToClipboard(networkInfo.ip)
                }
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Copy IP address"
              >
                <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
            <div className="text-lg font-medium text-white">
              {networkInfo?.ip || "Unknown"}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Connection Info */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Connection Details
          </h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-black/30">
            <div className="text-sm text-gray-400 mb-1">Connection Type</div>
            <div className="text-lg font-medium text-white">
              {(navigator as any).connection?.type || "Unknown"}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black/30">
            <div className="text-sm text-gray-400 mb-1">Connection Status</div>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  navigator.onLine ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-lg font-medium text-white">
                {navigator.onLine ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {networkInfo?.regionalSpeeds && (
            <div className="p-4 rounded-lg bg-black/30">
              <div className="text-sm text-gray-400 mb-1">
                Regional Average Speeds
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Download</div>
                  <div className="text-white font-medium">
                    {networkInfo.regionalSpeeds.averageDownload.toFixed(1)} Mbps
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Upload</div>
                  <div className="text-white font-medium">
                    {networkInfo.regionalSpeeds.averageUpload.toFixed(1)} Mbps
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Ping</div>
                  <div className="text-white font-medium">
                    {networkInfo.regionalSpeeds.averagePing.toFixed(0)} ms
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
