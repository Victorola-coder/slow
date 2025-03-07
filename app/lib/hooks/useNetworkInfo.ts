import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "@/app/constants";
import { getNetworkInfo } from "@/app/lib/networkInfo";

interface UseNetworkInfoReturn {
  networkInfo: NetworkInfoData | null;
  loading: boolean;
  refreshing: boolean;
  refreshNetworkInfo: () => Promise<void>;
}

export function useNetworkInfo(): UseNetworkInfoReturn {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNetworkInfo = useCallback(async () => {
    setRefreshing(true);
    try {
      const info = await getNetworkInfo();
      setNetworkInfo(info as NetworkInfoData);
    } catch (error) {
      console.error("Failed to fetch network info:", error);
      try {
        const response = await fetch(API_ENDPOINTS.networkInfo);
        const data = await response.json();
        setNetworkInfo(data);
      } catch (apiError) {
        console.error("API fallback failed:", apiError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworkInfo();

    // Listen for online/offline events
    window.addEventListener("online", fetchNetworkInfo);
    window.addEventListener("offline", fetchNetworkInfo);

    // Listen for VPN/connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener("change", fetchNetworkInfo);
    }

    // Refresh every 30 seconds to catch VPN changes, but only when tab is active
    let intervalId: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Start interval when tab is visible
        intervalId = setInterval(fetchNetworkInfo, 30000);
      } else if (intervalId) {
        // Clear interval when tab is hidden
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Set up visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial setup based on current visibility
    handleVisibilityChange();

    return () => {
      window.removeEventListener("online", fetchNetworkInfo);
      window.removeEventListener("offline", fetchNetworkInfo);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (connection) {
        connection.removeEventListener("change", fetchNetworkInfo);
      }

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchNetworkInfo]);

  return {
    networkInfo,
    loading,
    refreshing,
    refreshNetworkInfo: fetchNetworkInfo,
  };
}
