import React from "react";
import clsx from "clsx";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

import { ChartsData } from "@/libs/constants/dashboard/chartsData.js";
import { useThemeStore } from "@/store/useThemeStore.js";
import { useUserStore } from "@/store/useUserStore.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const getChartOptions = (textColor: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const,
      labels: {
        color: textColor,
        boxWidth: 18,
        usePointStyle: true,
        pointStyle: "circle",
        boxHeight: 18,
        borderRadius: 4,
        useBorderRadius: true,
        borderWidth: 0,
        generateLabels: function (chart: any) {
          const data = chart.data;
          const dataset = data.datasets[0];
          const meta = chart.getDatasetMeta(0);

          return data.labels.map((label: any, i: any) => ({
            text: label,
            fillStyle:
              dataset.backgroundColor?.[i]?.replace(/80$/, "") || "#ccc",
            strokeStyle: "transparent",
            lineWidth: 0,
            index: i,
            fontColor: textColor,
            datasetIndex: 0,
            hidden: meta.data[i]?.hidden || false,
          }));
        },
      },
    },
    title: {
      display: true,
      text: "Monthly Glucose Distribution",
      position: "top" as const,
      color: textColor,
      font: {
        family: "Montserrat",
        weight: 600,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.label || ""}: ${context.parsed || 0}`;
        },
        labelColor: function (context: any) {
          return {
            backgroundColor:
              context.dataset.borderColor?.[context.dataIndex] || "#3B82F6",
            borderColor: "transparent",
          };
        },
      },
    },
  },
});

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

const PieChart = () => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const textColor = darkMode ? "#e5e7eb" : "#1E293B";

  const user = useUserStore((state) => state.user);
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";
  const targetRange = user?.medicalProfile?.targetBloodSugarRange;

  const { pieChartData } = ChartsData("month", unit, targetRange);
  const options = getChartOptions(textColor);

  if (!pieChartData) return null;

  return (
    <div className={containerClasses}>
      <Pie data={pieChartData} options={options} />
    </div>
  );
};

export default PieChart;
