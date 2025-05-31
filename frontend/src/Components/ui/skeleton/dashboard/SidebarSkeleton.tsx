import React from "react";
import clsx from "clsx";

const SidebarSkeleton = () => {
  return (
    <aside
      className={clsx(
        "fixed h-[calc(100vh-88px-4px)] z-20 w-20 rounded-3xl flex items-center flex-col py-8 mb-1",
        "max-lg:fixed max-lg:bottom-1 max-lg:left-0 max-lg:right-0 max-lg:w-[calc(100%-3rem)] max-lg:h-[83px] max-lg:flex-row max-lg:rounded-3xl max-lg:py-3 max-lg:mx-6",
        "max-sm:max-sm:w-[calc(100%-2rem)] max-sm:mx-4",
        "overflow-hidden"
      )}
    >
      <div
        className={clsx(
          "absolute inset-0",
          "bg-gradient-to-b from-secondary/90 from-[60%] to-primary",
          "max-lg:bg-gradient-to-r max-lg:from-secondary max-lg:to-primary",
          "dark:bg-gradient-to-b dark:from-blue-700 dark:from-[0] dark:to-indigo-700",
          "dark:max-lg:bg-gradient-to-r dark:max-lg:from-blue-700 dark:max-lg:to-indigo-700"
        )}
      />

      <div className="absolute inset-0 shimmer-effect" />
    </aside>
  );
};

export default SidebarSkeleton;
