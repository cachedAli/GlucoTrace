import clsx from "clsx";

import { useThemeStore } from "@/store/useThemeStore.js";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import CardsSkeleton from "../dashboardPages/CardsSkeleton";

const HistoryCardSkeleton = () => {
  const { darkMode } = useThemeStore();

  return (
    <div
      className={clsx(
        "border shadow border-gray-200 rounded-2xl flex flex-col gap-2 py-4 px-6 bg-gray-50",
        "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
        "w-full h-full flex-1",
        "max-lg:max-w-full"
      )}
    >
      {/* Top heading */}
      <h1
        className={clsx(
          "font-montserrat text-2xl font-semibold mb-2",
          "max-sm:text-lg"
        )}
      >
        <CardsSkeleton width={225} height={30} darkMode={darkMode} />
      </h1>

      {/* Content area */}
      <div className="flex flex-col justify-between h-full gap-6">
        <div className="grid gap-4">
          {/* First row of stat cards */}
          <div className={clsx("flex gap-4", "max-sm:flex-col")}>
            <div className="w-1/2 max-sm:w-full p-4 rounded-lg border border-gray-600 dark:border-gray-300">
              <CardsSkeleton width={60} height={18} darkMode={darkMode} />
              <CardsSkeleton width={35} height={20} darkMode={darkMode} />
            </div>
            <div className="w-1/2 max-sm:w-full p-4 rounded-lg border border-gray-600 dark:border-gray-300">
              <CardsSkeleton width={80} height={18} darkMode={darkMode} />
              <div className="flex items-center">
                <CardsSkeleton width={30} height={20} darkMode={darkMode} />
                <span className="mx-1"></span>
                <CardsSkeleton width={30} height={20} darkMode={darkMode} />
              </div>
            </div>
          </div>

          {/* Second row of stat cards */}
          <div className={clsx("flex gap-4", "max-sm:flex-col")}>
            <div className="w-1/2 max-sm:w-full p-4 rounded-lg border border-gray-600 dark:border-gray-300">
              <CardsSkeleton width={150} height={18} darkMode={darkMode} />
              <CardsSkeleton width={100} height={23} darkMode={darkMode} />
            </div>
            <div className="w-1/2 max-sm:w-full p-4 rounded-lg border border-gray-600 dark:border-gray-300">
              <CardsSkeleton width={150} height={18} darkMode={darkMode} />
              <CardsSkeleton width={100} height={23} darkMode={darkMode} />
            </div>
          </div>

          {/* Third stat card */}
          <div className="p-4 rounded-lg border border-gray-600 dark:border-gray-300">
            <CardsSkeleton width={150} height={18} darkMode={darkMode} />
            <CardsSkeleton width={100} height={23} darkMode={darkMode} />
          </div>
        </div>

        {/* Button */}
        <div className="relative overflow-hidden rounded-xl w-full h-12">
          <Skeleton
            className="h-12 md:h-14 rounded-xl"
            baseColor="#1d4ed8"
            borderRadius="12px"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryCardSkeleton;
