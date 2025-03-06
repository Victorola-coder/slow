"use client";

import { useEffect, useState } from "react";
import ISPSpeedStats from "./ISPSpeedStats";

export default function DynamicISPStats() {
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        const response = await fetch("/api/network-info");
        if (response.ok) {
          const data = await response.json();
          setNetworkInfo(data);

          // Show the container once we have data
          const container = document.getElementById("ispStatsContainer");
          if (container) {
            container.classList.remove("hidden");
          }
        }
      } catch (error) {
        console.error("Error fetching network info for ISP stats:", error);
      }
    };

    fetchNetworkInfo();
  }, []);

  if (!networkInfo) return null;

  return (
    <ISPSpeedStats
      provider={networkInfo.provider}
      location={networkInfo.location}
    />
  );
}
