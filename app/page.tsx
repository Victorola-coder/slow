import React from "react";
import SpeedTest from "./components/SpeedTest";
import NetworkInfo from "./components/NetworkInfo";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
          SpeedPulse
        </h1>
        <SpeedTest />
        <NetworkInfo />
      </div>
    </main>
  );
}
