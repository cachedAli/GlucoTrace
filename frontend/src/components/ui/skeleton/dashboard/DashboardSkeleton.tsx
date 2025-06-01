import React from "react";
import clsx from "clsx";

import DashboardPagesSkeleton from "./DashboardPagesSkeleton";
import SidebarSkeleton from "./SidebarSkeleton";
import HeaderSkeleton from "./HeaderSkeleton";

const DashboardSkeleton = () => {
  return (
    <div className={clsx("w-full font-inter min-h-screen flex flex-col")}>
      <HeaderSkeleton />
      <div
        className={clsx("flex flex-1 mx-12 pt-2", "max-lg:mx-6", "max-sm:mx-4")}
      >
        <SidebarSkeleton />
        <div
          className={clsx(
            "flex-1 px-12 ml-20 flex flex-col gap-3 mb-6 w-full",
            "max-lg:ml-0 max-lg:px-0 max-lg:mb-28"
          )}
        >
          <DashboardPagesSkeleton />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
