import React from "react";
import clsx from "clsx";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { ChartsData } from "@/libs/constants/dashboard/chartsData.js";
import { useThemeStore } from "@/store/useThemeStore.js";
import { useUserStore } from "@/store/useUserStore.js";

// Register ChartJS components at module level
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Container classes configuration
const containerClasses = clsx(
  "relative",
  "w-[80vw]",
  "h-[27vw]",
  "max-[1130px]:min-[1024px]:w-[78vw]",
  "max-lg:w-[92vw]",
  "max-sm:h-[35vw]",
  "max-sm:w-[92vw]",
  "max-[500px]:h-[50vw]"
);

// Helper function to generate chart options
const getChartOptions = (
  textColor: string,
  darkMode: boolean,
  unit: string,
  getStatusTooltipFooter: (value: number) => string
) => ({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const,
      labels: { color: textColor },
      onClick: () => {}, // Disable legend click interaction
    },
    tooltip: {
      mode: "index" as const,
      intersect: true,
      callbacks: {
        footer: (tooltipItems: TooltipItem<"line">[]) => {
          return getStatusTooltipFooter?.(tooltipItems[0].parsed.y);
        },
        label: (context: any) => `Average: ${context.raw} ${unit}`,
      },
    },
  },
  scales: {
    y: {
      suggestedMin: unit === "mmol/L" ? 3 : 50,
    suggestedMax: unit === "mmol/L" ? 18 : 300,
      title: {
        display: true,
        text: unit,
        color: textColor,
      },
      grid: { color: darkMode ? "#3f3f46" : "#dde2e6" },
      ticks: { color: textColor },
    },
    x: {
      title: { display: false },
      grid: { color: darkMode ? "#3f3f46" : "#dde2e6" },
      ticks: { color: textColor },
    },
  },
});

const LineChart = ({ view }: { view: "month" | "week" }) => {
  // Get user data
  const user = useUserStore((state) => state.user);
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";
  const targetRange = user?.medicalProfile?.targetBloodSugarRange;

  // Get theme data
  const darkMode = useThemeStore((state) => state.darkMode);
  const textColor = darkMode ? "#e5e7eb" : "#1E293B";

  // Get chart data
  const { lineChartData, getStatusTooltipFooter } = ChartsData(
    view,
    unit,
    targetRange
  );

  if (!lineChartData) return null;

  return (
    <div className={containerClasses}>
      <Line
        options={getChartOptions(
          textColor,
          darkMode,
          unit,
          getStatusTooltipFooter
        )}
        data={lineChartData}
      />
    </div>
  );
};

export default LineChart;
