import { useThemeStore } from "@/store/useThemeStore.js";
import Skeleton from "react-loading-skeleton";

const ChartSkeleton = () => {
  const { darkMode } = useThemeStore();
  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <div className="relative h-80">
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between">
          {[300, 250, 200, 150, 100, 50].map((val) => (
            <div key={val} className="flex items-center">
              <div className="w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2" />
              <div className="w-1 h-px bg-gray-300 dark:bg-gray-700 flex-grow" />
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-8 border-l border-b border-gray-300 dark:border-gray-700">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full h-px bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>

          {/* Vertical grid lines */}
          <div className="absolute inset-0 flex justify-between">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-full w-px bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-10 right-0 h-8 flex justify-between items-start max-sm:w">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="flex flex-col items-center">
              <div className="w-1 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse" />
              <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 mt-3">
        <Skeleton height={15} width={45} baseColor="#2563eb" />
        <Skeleton
          height={15}
          width={160}
          baseColor={darkMode ? "#374151" : "#e0e0e0"}
          highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
        />
      </div>
    </div>
  );
};

export default ChartSkeleton;
