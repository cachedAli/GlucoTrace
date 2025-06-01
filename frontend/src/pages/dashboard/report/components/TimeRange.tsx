import React from "react";

import { ThemeProvider, ToggleButton, ToggleButtonGroup } from "@mui/material";

import getInputTheme from "@/components_temp/ui/inputs/inputTheme";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useThemeStore } from "@/store/useThemeStore";
import CustomDateRange from "./CustomDateRange";

type TimeRangeValue = "last7Days" | "thisMonth" | "custom";

const timeOptions: { value: TimeRangeValue; label: string }[] = [
  { value: "last7Days", label: "Last 7 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "custom", label: "Custom Range" },
];

const TimeRange: React.FC = () => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const { timeRange, setTimeRange } = useDashboardStore();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newTimeRange: TimeRangeValue | null
  ) => {
    if (newTimeRange) {
      setTimeRange(newTimeRange);
    }
  };

  const getSelectedGradient = () =>
    darkMode
      ? "linear-gradient(to bottom, rgba(29, 78, 216, 0.9), rgba(67, 56, 202, 1))"
      : "linear-gradient(to bottom, rgba(40, 53, 147, 0.9), #1a237e)";

  const getHoverColor = () => (darkMode ? "#1e40af" : "#2563eb");

  const getHoverBg = () =>
    darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.1)";

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={timeRange}
        exclusive
        onChange={handleChange}
        aria-label="Time Range"
        fullWidth
      >
        {timeOptions.map(({ value, label }) => (
          <ToggleButton
            key={value}
            disableRipple
            value={value}
            sx={{
              borderRadius: "10px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              padding: "8px 16px",
              textTransform: "none",
              borderColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "#d1d5db",
              color: darkMode ? "#ffffff" : "#1f2937",

              "&:not(:last-of-type)": {
                borderRight: "none",
              },
              "&:not(:first-of-type)": {
                borderLeft: "none",
              },

              "&.Mui-selected": {
                background: getSelectedGradient(),
                color: "#fff",
                fontWeight: 600,
                borderColor: darkMode ? "#1a237e" : "rgba(67, 56, 202, 1)",
                "&:hover": {
                  backgroundColor: getHoverColor(),
                },
              },

              "&:hover": {
                backgroundColor: getHoverBg(),
              },
            }}
          >
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {timeRange === "custom" && (
        <ThemeProvider theme={getInputTheme(darkMode)}>
          <CustomDateRange />
        </ThemeProvider>
      )}
    </>
  );
};

export default TimeRange;
