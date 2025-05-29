import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StatName, Stats } from "@/types/dashboardTypes";
import {
  getPreviousStat,
  saveStat as saveStatAPI,
  archiveStats,
} from "../services/statsServices";

interface StatsState {
  [key: string]: Stats | null;
}

interface StatsContextType {
  stats: StatsState;
  isStatsInitialized: boolean;
  updateStat: (statName: StatName, newStat: Stats) => void;
  recalculateAllStats: () => void;
}

const StatsContext = createContext<StatsContextType>({
  stats: {},
  isStatsInitialized: false,
  updateStat: () => {},
  recalculateAllStats: () => {},
});

export const useStats = () => useContext(StatsContext);

export const StatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<StatsState>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const statQueue = React.useRef<Record<string, Stats>>({});
  const saveTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Initialize stats on mount
  useEffect(() => {
    const initializeStats = async () => {
      const statNames: StatName[] = [
        "sevenDayAverage",
        "targetRange",
        "highLow",
        "monthlyChange",
        "morningEvening",
      ];

      const statsData: StatsState = {};

      for (const name of statNames) {
        statsData[name] = await getPreviousStat(name);
      }

      setStats(statsData);
      setIsInitialized(true);
    };

    initializeStats();

    // Setup archiving scheduler
    const setupScheduler = () => {
      const now = new Date();
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7));
      nextMonday.setHours(0, 0, 0, 0);

      const timeUntilMonday = nextMonday.getTime() - now.getTime();

      const timerId = setTimeout(() => {
        archiveStats();
        const intervalId = setInterval(archiveStats, 604800000); // 7 days
        return () => clearInterval(intervalId);
      }, timeUntilMonday);

      return () => clearTimeout(timerId);
    };

    const cleanup = setupScheduler();
    return cleanup;
  }, []);

  // Batch save stats every 500ms
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      if (Object.keys(statQueue.current).length > 0) {
        Object.entries(statQueue.current).forEach(([name, stat]) => {
          saveStatAPI(name, stat);
        });
        statQueue.current = {};
      }
    }, 500);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [stats]);

  const updateStat = useCallback((statName: StatName, newStat: Stats) => {
    setStats((prev) => {
      // Skip update if value hasn't changed
      if (prev[statName]?.value === newStat.value) return prev;

      return {
        ...prev,
        [statName]: newStat,
      };
    });

    // Queue for batched save
    statQueue.current[statName] = newStat;
  }, []);

  const recalculateAllStats = () => {
    // This would trigger all stat recalculations
    // Implementation would depend on your specific calculation logic
    console.log("Recalculating all stats");
  };

  return (
    <StatsContext.Provider
      value={{
        stats,
        isStatsInitialized: isInitialized,
        updateStat,
        recalculateAllStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
