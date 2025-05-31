import { useThemeStore } from "@/store/useThemeStore.js";
import Skeleton from "react-loading-skeleton";

const SearchBarSkeleton = () => {
  const { darkMode } = useThemeStore();
  return (
    <div className="w-full">
      <Skeleton
        height={55}
        width={"100%"}
        borderRadius={"50px"}
        baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
        highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
      />
    </div>
  );
};

export default SearchBarSkeleton;
