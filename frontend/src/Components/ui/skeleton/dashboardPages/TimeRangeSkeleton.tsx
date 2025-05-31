import React from "react";
import clsx from "clsx";

import { useThemeStore } from "@/store/useThemeStore.js";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const TimeRangeSkeleton = () => {
  const { darkMode } = useThemeStore();
  // Calculate gradient colors based on darkMode
  const selectedGradient = darkMode
    ? "linear-gradient(to bottom, rgba(29, 78, 216, 0.9), rgba(67, 56, 202, 1))"
    : "linear-gradient(to bottom, rgba(40, 53, 147, 0.9), #1a237e)";

  const borderColor = darkMode ? "rgba(255, 255, 255, 0.3)" : "#d1d5db";
  const unselectedBg = darkMode ? "bg-gray-800" : "bg-gray-50";

  return (
    <div className="w-full">
      {/* Toggle Button Group Skeleton */}
      <div
        className="flex rounded-[10px] overflow-hidden border"
        style={{ borderColor }}
      >
        {/* Selected Button (Last 7 Days) */}
        <div
          className="flex-1  px-4 relative text-center overflow-hidden "
          style={{
            background: selectedGradient,
            borderRight: "none",
          }}
        >
          <div className="absolute shimmer-effect h-40"></div>
        </div>

        {/* Unselected Buttons */}
        <div
          className={clsx(
            "flex-1 py-2 px-4 text-center border-l relative overflow-hidden",
            unselectedBg
          )}
        >
          <div className="absolute shimmer-effect-dark inset-0"></div>
        </div>

        <div
          className={clsx(
            "flex-1 py-2 px-4 text-center relative overflow-hidden border-l",
            unselectedBg
          )}
        >
          <div className="absolute shimmer-effect-dark inset-0"></div>

          <Skeleton width={100} height={20} className=" !hidden" />
        </div>
      </div>
    </div>
  );
};

export default TimeRangeSkeleton;
