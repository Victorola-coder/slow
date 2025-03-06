import React from "react";
import SpeedTest from "./components/SpeedTest";
import NetworkInfo from "./components/NetworkInfo";
import Toast from "./components/ui/toast";
import DynamicISPStats from "./components/DynamicISPStats";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#0A0A0A]">
      <Toast />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            SpeedPulse
          </h1>
          <p className="text-gray-400 text-lg">
            Test your internet speed and network performance
          </p>
        </div>
        <SpeedTest />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NetworkInfo />
          <div id="ispStatsContainer">
            <DynamicISPStats />
          </div>
        </div>
      </div>
      <footer className="text-center text-gray-400 text-sm mt-8 flex flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Pulse. All rights reserved.</p>
        <p className="text-primary text-base">
          <a
            href="https://techgix.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            Techgix
          </a>
        </p>
      </footer>
    </main>
  );
}
