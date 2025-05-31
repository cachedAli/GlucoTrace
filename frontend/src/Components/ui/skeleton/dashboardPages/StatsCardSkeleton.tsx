import Skeleton from "react-loading-skeleton";

interface StatsCardSkeletonProps {
  index: number;
  darkMode?: boolean;
  borderRadius?: string;
  width?: number | string;
  height?: number | string;
  trend?: boolean;
  inline?: boolean;
}

const StatsCardSkeleton = ({
  index,
  darkMode,
  width,
  height,
  borderRadius,
  trend = false,
  inline = false,
}: StatsCardSkeletonProps) => {
  const baseColor =
    index === 0
      ? !trend
        ? darkMode
          ? "#1d4ed8"
          : " #1e40af"
        : "#86efac"
      : !trend
      ? darkMode
        ? "#93c5fd"
        : "#bfdbfe"
      : "#4ade80";

  const highlightColor =
    index === 0
      ? !trend
        ? darkMode
          ? "#3b82f6"
          : "#2563eb"
        : "#22c55e"
      : !trend
      ? darkMode
        ? "#60a5fa"
        : "#93c5fd"
      : "#22c55e";

  return (
    <Skeleton
      width={width}
      height={height}
      className="to-blue-800"
      inline={inline}
      borderRadius={borderRadius}
      baseColor={baseColor}
      highlightColor={highlightColor}
    />
  );
};

export default StatsCardSkeleton;
