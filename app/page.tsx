import React from "react";
import SpeedTest from "./components/SpeedTest";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <SpeedTest />
      </div>
    </main>
  );
}
