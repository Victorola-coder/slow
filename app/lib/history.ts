import { cacheManager } from "./cache";
import type { SpeedTestResult } from "../types/speed";

const HISTORY_KEY = "speedtest_history";

export const historyManager = {
  saveResult: (result: SpeedTestResult) => {
    const history = cacheManager.get<SpeedTestResult[]>(HISTORY_KEY) || [];
    history.unshift(result);
    // Keep last 10 results
    const trimmedHistory = history.slice(0, 10);
    cacheManager.set(HISTORY_KEY, trimmedHistory);
  },

  getHistory: (): SpeedTestResult[] => {
    return cacheManager.get<SpeedTestResult[]>(HISTORY_KEY) || [];
  },

  clearHistory: () => {
    cacheManager.clear(HISTORY_KEY);
  },
};
