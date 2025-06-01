import Skeleton from "react-loading-skeleton";

interface CardSkeletonProps {
  darkMode?: boolean;
  borderRadius?: string;
  report?:boolean;
  width?: number | string;
  height?: number | string;
  inline?: boolean;
}

const CardsSkeleton = ({
  darkMode,
  width,
  height,
  report=false,
  borderRadius,
  inline = false,
}: CardSkeletonProps) => {
  const baseColor =  darkMode ? !report ? "#4b5563" : "#9ca3af" : !report ?"#e0e0e0" :"#9ca3af";

  const highlightColor = darkMode ? !report ? "#6b7280" : " #d1d5db" :   !report ?"#eeeded" : " #d1d5db";

  return (
    <Skeleton
      width={width}
      height={height}
      inline={inline}
      borderRadius={borderRadius}
      baseColor={baseColor}
      highlightColor={highlightColor}
    />
  );
};

export default CardsSkeleton;
