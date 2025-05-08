import React from "react";
import clsx from "clsx";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { ChartsData } from "@/libs/constants/dashboard/chartsData";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";

// Register ChartJS components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Container classes
const containerClasses = clsx(
  "relative",
  "w-[40vw]",
  "max-xl:w-[35vw]",
  "h-[27vw]",
  "max-lg:w-[40vw]",
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
      labels: {
        color: textColor,
        generateLabels: function (chart: any) {
          return chart.data.datasets.map((dataset: any, i: any) => ({
            text: dataset.label,
            borderWidth: 0,
            fillStyle: "#3B82F6",
            strokeStyle: "#3B82F6",
            lineWidth: 3,
            pointStyle: "rect",
            hidden: !chart.isDatasetVisible(i),
            index: i,
            fontColor: textColor,
          }));
        },
      },
    },
    tooltip: {
      mode: "index" as const,
      intersect: true,
      callbacks: {
        footer: (tooltipItems: TooltipItem<"bar">[]) => {
          return getStatusTooltipFooter?.(tooltipItems[0].parsed.y);
        },
        label: (context: any) => `Average: ${context.raw} ${unit}`,
        labelColor: (context: any) => ({
          backgroundColor:
            context.dataset.borderColor?.[context.dataIndex] || "#3B82F6",
          borderColor: "transparent",
        }),
      },
    },
  },
  scales: {
    y: {
      suggestedMin: 50,
      suggestedMax: 300,
      title: {
        display: true,
        text: unit,
        color: textColor,
      },
      grid: {
        color: darkMode ? "#3f3f46" : "#dde2e6",
      },
      ticks: {
        color: textColor,
      },
    },
    x: {
      title: {
        display: false,
      },
      grid: {
        color: darkMode ? "#3f3f46" : "#dde2e6",
      },
      ticks: {
        color: textColor,
      },
    },
  },
});

const BarChart = () => {
  // Get user data
  const user = useUserStore((state) => state.user);
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";
  const targetRange = user?.medicalProfile?.targetBloodSugarRange;

  // Get theme data
  const darkMode = useThemeStore((state) => state.darkMode);
  const textColor = darkMode ? "#e5e7eb" : "#1E293B";

  // Get chart data
  const { barChartData, getStatusTooltipFooter } = ChartsData(
    "month",
    unit,
    targetRange
  );

  if (!barChartData) return null;

  return (
    <div className={containerClasses}>
      <Bar
        options={getChartOptions(
          textColor,
          darkMode,
          unit,
          getStatusTooltipFooter
        )}
        data={barChartData}
      />
    </div>
  );
};

export default BarChart;
