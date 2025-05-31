import React from "react";
import clsx from "clsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useThemeStore } from "@/store/useThemeStore.js";
import { useLocation } from "react-router-dom";
import SearchBarSkeleton from "../dashboardPages/SearchBarSkeleton";

const HeaderSkeleton = () => {
  const { darkMode } = useThemeStore();
  const location = useLocation();
  const isHistoryPage = location.pathname === "/dashboard/history";
  return (
    <header
      className={clsx(
        "sticky z-10 top-0 bg-white dark:bg-gray-900 h-auto w-full",
        "flex flex-col"
      )}
    >
      {/* Top row */}
      <div className="w-full flex px-8 gap-28 max-sm:px-4 items-center justify-between h-20">
        {/* Logo skeleton */}
        <div className="flex items-center h-10">
          <Skeleton
            className="max-w-[173px] w-auto mb-2 max-sm:max-w-[60px]"
            height={40}
            width={170}
            baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
            highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
          />
        </div>
        {isHistoryPage && (
          <div className="flex-1 hidden lg:flex justify-center">
            <SearchBarSkeleton />
          </div>
        )}

        {/* User profile skeleton */}
        <div className={clsx("flex items-center gap-2")}>
          <Skeleton
            circle
            width={40}
            height={40}
            className="max-sm:size-8"
            baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
            highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
          />

          <div className="flex flex-col">
            <Skeleton
              width={100}
              height={14}
              className="max-sm:!h-3 max-sm:!w-[80px]"
              baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
              highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
            />
            <Skeleton
              width={80}
              height={12}
              className="mt-1 max-sm:!h-3 max-sm:!w-[60px]"
              baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
              highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
            />
          </div>
        </div>
      </div>

      {/* Bottom row (mobile search) */}
      {isHistoryPage && (
        <div className="block lg:hidden px-8 max-sm:px-4 pb-2">
          <SearchBarSkeleton />
        </div>
      )}
    </header>
  );
};

export default HeaderSkeleton;
