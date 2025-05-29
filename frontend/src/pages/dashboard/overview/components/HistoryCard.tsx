import clsx from "clsx";

import { isWithinInterval, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

import {
  getBestReadingDay,
  getThisWeekReadings,
  getUpdatedHighLowStats,
} from "@/libs/utils/statFieldUtils";
import OverviewCardWrapper from "@/components/ui/dashboard/wrapper/OverviewCardWrapper";
import { TargetRange, Unit } from "@/types/dashboardTypes";
import { useReadingStore } from "@/store/useReadingStore";
import { useStats } from "@/providers/StatsProvider";
import { useUserStore } from "@/store/useUserStore";
import { convertToMmol } from "@/libs/utils/utils";
import Button from "@/components/ui/common/Button";
import { Reading } from "@/types/userTypes";

const StatCard = ({
  title,
  value,
  className,
  children,
}: {
  title: string;
  value: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={clsx(
      "p-4 rounded-lg border",
      "border-gray-600 dark:border-gray-300",
      className
    )}
  >
    <h2
      className={clsx(
        "text-gray-600 font-medium",
        "max-sm:text-sm",
        "dark:text-gray-300"
      )}
    >
      {title}
    </h2>
    <div className={clsx("text-xl font-semibold", "max-sm:text-base")}>
      {value}
    </div>
    {children}
  </div>
);

const HistoryCard = () => {
  const navigate = useNavigate();
  const { stats } = useStats();
  const readings = useReadingStore((state) => state.readings);
  const user = useUserStore((state) => state.user);
  const unit = user?.medicalProfile?.bloodSugarUnit ?? "mg/dL";
  const targetRange = user?.medicalProfile?.targetBloodSugarRange;

  // Meal timing helpers
  const getMealTimingLabel = (timing: Reading["mealTiming"]) => {
    if (typeof timing === "string") return timing;
    return "custom" in timing ? timing.custom : "Unknown";
  };

  const countMealTimeHighsLows = (
    readings: Reading[],
    targetRange: TargetRange = { min: 70, max: 180 },
    unit: Unit
  ) => {
    const mealCounts: Record<string, { highs: number; lows: number }> = {};

    const max =
      unit === "mmol/L"
        ? Number(convertToMmol(targetRange.max, unit, false))
        : targetRange.max;
    const min =
      unit === "mmol/L"
        ? Number(convertToMmol(targetRange.min, unit, false))
        : targetRange.min;

    readings.forEach((reading) => {
      const meal = getMealTimingLabel(reading.mealTiming);
      if (!mealCounts[meal]) mealCounts[meal] = { highs: 0, lows: 0 };

      const readingValue =
        unit === "mmol/L"
          ? Number(convertToMmol(reading.value, unit, false))
          : reading.value;

      if (readingValue > max) mealCounts[meal].highs += 1;
      else if (readingValue < min) mealCounts[meal].lows += 1;
    });

    return mealCounts;
  };

  const getWeeklyReadings = (readings: Reading[]) => {
    const now = new Date();
    return readings.filter((reading) =>
      isWithinInterval(new Date(reading.timestamp), {
        start: subDays(now, 6),
        end: now,
      })
    );
  };

  // Data calculations
  const weeklyReadings = getWeeklyReadings(readings);
  const mealCounts = countMealTimeHighsLows(weeklyReadings, targetRange, unit);

  const { mostHighs, mostLows } = Object.entries(mealCounts).reduce(
    (acc, [meal, { highs, lows }]) => {
      if (highs > acc.mostHighs.count) {
        acc.mostHighs = { meal, count: highs };
      }
      if (lows > acc.mostLows.count) {
        acc.mostLows = { meal, count: lows };
      }
      return acc;
    },
    { mostHighs: { meal: "", count: 0 }, mostLows: { meal: "", count: 0 } }
  );

  const highLowStats = getUpdatedHighLowStats(readings, stats.highLow, unit);
  const bestDayStats = getBestReadingDay(readings);
  const thisWeekReadings = getThisWeekReadings(readings);

  return (
    <OverviewCardWrapper label="Weekly Summary" className="h-full">
      <div className="flex flex-col justify-between h-full gap-6">
        <div className="grid gap-4">
          <div className={clsx("flex gap-4", "max-sm:flex-col")}>
            <StatCard
              title="Entries"
              value={thisWeekReadings.length}
              className="w-1/2 max-sm:w-full"
            />
            <StatCard
              title="Highs / Lows"
              value={`${highLowStats.high ?? 0} / ${highLowStats.low ?? 0}`}
              className="w-1/2 max-sm:w-full"
            />
          </div>

          <div className={clsx("flex gap-4", "max-sm:flex-col")}>
            <StatCard
              title="Most Lows (Meal Time)"
              value={mostLows.meal || "-"}
              className="w-1/2 max-sm:w-full"
            />
            <StatCard
              title="Most Highs (Meal Time)"
              value={mostHighs.meal || "-"}
              className="w-1/2 max-sm:w-full"
            />
          </div>

          <StatCard title="Best Day for Readings" value={bestDayStats.value} />
        </div>

        <Button
          type="button"
          variant="fill"
          className="w-full"
          onClick={() => navigate("/dashboard/history")}
        >
          View Full History
        </Button>
      </div>
    </OverviewCardWrapper>
  );
};

export default HistoryCard;
