import React, { useEffect, useState } from "react";
import clsx from "clsx";

import "react-loading-skeleton/dist/skeleton.css";
import { useThemeStore } from "@/store/useThemeStore.js";
import Skeleton from "react-loading-skeleton";
import CardsSkeleton from "../dashboardPages/CardsSkeleton";

type OverviewFullCardSkeletonProps = {
  type: "addReading" | "download";
};

const OverviewFullCardSkeleton = ({ type }: OverviewFullCardSkeletonProps) => {
  const { darkMode } = useThemeStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className={clsx(
        "border shadow border-gray-200 rounded-2xl flex flex-col gap-2 py-4 px-6 bg-gray-50",
        "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
        "w-full flex-1",
        "max-lg:max-w-full"
      )}
    >
      {/* Top heading - preserved */}
      <h1
        className={clsx(
          "font-montserrat text-2xl font-semibold mb-2",
          "max-sm:text-lg"
        )}
      >
        {type === "download" ? (
          <CardsSkeleton
            width={isMobile ? 250 : 335}
            height={30}
            darkMode={darkMode}
          />
        ) : (
          <CardsSkeleton width={180} height={30} darkMode={darkMode} />
        )}
      </h1>

      {/* Content area */}
      <div className="flex-1">
        {type === "addReading" ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-2">
              <CardsSkeleton
                height={34}
                width={60}
                inline
                darkMode={darkMode}
              />
              <CardsSkeleton height={23} width={65} darkMode={darkMode} />
            </div>
            <CardsSkeleton height={15} width={133} darkMode={darkMode} />
            <CardsSkeleton height={15} width={80} darkMode={darkMode} />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full flex items-center justify-between">
                <CardsSkeleton width={100} height={15} darkMode={darkMode} />
                <CardsSkeleton width={40} height={15} darkMode={darkMode} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button - preserved color */}
      <div className="relative overflow-hidden rounded-xl w-full h-12">
        <Skeleton
          className="h-12 md:h-14 rounded-xl"
          baseColor="#1d4ed8"
          borderRadius="12px"
          width="100%"
        />
      </div>
    </div>
  );
};

export default OverviewFullCardSkeleton;
