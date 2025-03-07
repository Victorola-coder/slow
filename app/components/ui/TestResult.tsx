import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { formatSpeed, formatPing } from "@/app/lib/speedTest";

interface TestResultProps {
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  ping: number | null;
  averageDownload?: number | null;
  averageUpload?: number | null;
  averagePing?: number | null;
}

export function TestResult({
  downloadSpeed,
  uploadSpeed,
  ping,
  averageDownload,
  averageUpload,
  averagePing,
}: TestResultProps) {
  const copyResults = () => {
    const results = `
Speed Test Results:
Download: ${downloadSpeed ? formatSpeed(downloadSpeed) : "N/A"}
Upload: ${uploadSpeed ? formatSpeed(uploadSpeed) : "N/A"}
Ping: ${ping ? formatPing(ping) : "N/A"}
    `.trim();

    navigator.clipboard.writeText(results);
    toast.success("Results copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Test Results</h3>
        <button
          onClick={copyResults}
          className="p-2 rounded-lg bg-black/30 hover:bg-black/40 transition-colors"
          aria-label="Copy results to clipboard"
        >
          <Copy className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Download Speed */}
        <div className="p-4 rounded-lg bg-black/20">
          <div className="text-sm text-gray-400 mb-1">Download</div>
          <div className="text-2xl font-bold text-white">
            {downloadSpeed ? formatSpeed(downloadSpeed) : "N/A"}
          </div>
          {averageDownload && (
            <div className="text-xs text-gray-500 mt-1">
              Avg: {formatSpeed(averageDownload)}
            </div>
          )}
        </div>

        {/* Upload Speed */}
        <div className="p-4 rounded-lg bg-black/20">
          <div className="text-sm text-gray-400 mb-1">Upload</div>
          <div className="text-2xl font-bold text-white">
            {uploadSpeed ? formatSpeed(uploadSpeed) : "N/A"}
          </div>
          {averageUpload && (
            <div className="text-xs text-gray-500 mt-1">
              Avg: {formatSpeed(averageUpload)}
            </div>
          )}
        </div>

        {/* Ping */}
        <div className="p-4 rounded-lg bg-black/20">
          <div className="text-sm text-gray-400 mb-1">Ping</div>
          <div className="text-2xl font-bold text-white">
            {ping ? formatPing(ping) : "N/A"}
          </div>
          {averagePing && (
            <div className="text-xs text-gray-500 mt-1">
              Avg: {formatPing(averagePing)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
