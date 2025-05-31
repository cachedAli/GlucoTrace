import React from "react";
import clsx from "clsx";

import { useThemeStore } from "@/store/useThemeStore";
import { useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const PageTitleSkeleton = () => {
  const { darkMode } = useThemeStore();
  const location = useLocation();
  const isOverviewPage = location.pathname === "/dashboard";
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 640);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      {isOverviewPage ? (
        <>
          <Skeleton
            height={35}
            width={!isMobile ? 500 : 300}
            baseColor={darkMode ? "#668cff" : "#193798"}
            highlightColor={darkMode ? "#193798" : "#668cff"}
          />
          <Skeleton
            height={20}
            width={!isMobile ? 550 : 300}
            baseColor={darkMode ? "#b2cfff" : "#1a389c"}
            highlightColor={darkMode ? "#1a389c" : "#b2cfff"}
          />
        </>
      ) : (
        <div
          className={clsx(
            "flex flex-col gap-2 items-start justify-center",
            "max-sm:gap-1"
          )}
        >
          <h1
            className={clsx(
              "text-headingMain font-bold text-2xl",
              "max-lg:text-xl",
              "max-sm:text-lg",
              "dark:text-headingMain-dark"
            )}
          >
            <Skeleton
              height={30}
              width={300}
              baseColor={darkMode ? "#668cff" : "#193798"}
              highlightColor={darkMode ? "#193798" : "#668cff"}
            />
          </h1>

          <Skeleton
            height={20}
            width={!isMobile ? 380 : 300}
            baseColor={darkMode ? "#b2cfff" : "#1a389c"}
            highlightColor={darkMode ? "#1a389c" : "#b2cfff"}
          />
        </div>
      )}
    </div>
  );
};

export default PageTitleSkeleton;
