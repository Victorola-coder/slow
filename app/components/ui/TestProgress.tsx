import { motion } from "framer-motion";

interface TestProgressProps {
  progress: number;
  phase: "idle" | "ping" | "download" | "upload";
}

export function TestProgress({ progress, phase }: TestProgressProps) {
  const getPhaseLabel = () => {
    switch (phase) {
      case "ping":
        return "Testing ping...";
      case "download":
        return "Testing download speed...";
      case "upload":
        return "Testing upload speed...";
      default:
        return "";
    }
  };

  if (phase === "idle") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-8 p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10"
    >
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">
          Testing in progress
        </h3>
        <div className="text-sm text-gray-400">{progress}%</div>
      </div>

      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        />
      </div>

      <div className="mt-2 text-sm text-gray-400">{getPhaseLabel()}</div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div
          className={`p-2 rounded text-center text-xs font-medium ${
            phase === "ping"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              : "bg-black/20 text-gray-500"
          }`}
        >
          Ping
        </div>
        <div
          className={`p-2 rounded text-center text-xs font-medium ${
            phase === "download"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "bg-black/20 text-gray-500"
          }`}
        >
          Download
        </div>
        <div
          className={`p-2 rounded text-center text-xs font-medium ${
            phase === "upload"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-black/20 text-gray-500"
          }`}
        >
          Upload
        </div>
      </div>
    </motion.div>
  );
}
