import clsx from "clsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useThemeStore } from "@/store/useThemeStore";
import { useLocation } from "react-router-dom";

interface FullStateCardSkeletonProps {
  index?: number;
}

const FullStateCardSkeleton = ({ index }: FullStateCardSkeletonProps) => {
  const { darkMode } = useThemeStore();
  const location = useLocation();
  const isOverviewPage = location.pathname === "/dashboard";
  return (
    <div
      className={clsx(
        "py-4 px-3 w-full min-w-60 max-w-[300px] flex-1 shadow-md h-40 max-h-40 rounded-xl flex flex-col justify-between relative overflow-hidden",
        "max-lg:max-w-full max-lg:h-40 max-lg:max-h-full max-lg:flex-none",
        "max-sm:h-32",

        index === 0 && "max-lg:max-w-full max-lg:w-full",
        index === 0
          ? "bg-gradient-to-b from-secondary/90 to-primary dark:bg-gradient-to-b dark:from-blue-700/90 dark:from-[0] dark:to-indigo-700"
          : "bg-blue-100 border border-blue-200 dark:bg-blue-200 dark:border-blue-300"
      )}
    >
      {/* Top row - only icon placeholder */}
      <div
        className={clsx(
          "flex",
          isOverviewPage ? "justify-between" : "justify-end"
        )}
      >
        <Skeleton
          circle
          width={36}
          height={36}
          baseColor={
            darkMode
              ? index === 0
                ? "#111827"
                : "#4f46e5"
              : index === 0
              ? "#f8fafc"
              : "#f8fafc"
          }
          highlightColor={
            darkMode ? (index === 0 ? "#7FFFD4" : "#f8fafc") : "#4f46e5"
          }
          className={clsx(
            index === 0 ? "bg-slate-50 dark:bg-gray-900" : "bg-indigo-600"
          )}
        />
      </div>

      {/* Empty content space */}
      <div className="flex-1" />
      <div className="absolute inset-0 shimmer-effect" />
    </div>
  );
};

export default FullStateCardSkeleton;
