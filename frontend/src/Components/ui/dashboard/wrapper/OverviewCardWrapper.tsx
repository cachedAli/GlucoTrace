import React from "react";

import { cn } from "@/libs/utils/utils";

type OverviewCardWrapperProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};
const OverviewCardWrapper = ({
  label,
  children,
  className,
}: OverviewCardWrapperProps) => {
  return (
    <div
      className={cn(
        " border shadow border-gray-200 rounded-2xl flex flex-col gap-2 py-4 px-6 bg-gray-50",
        "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
        className
      )}
    >
      <h1
        className={cn(
          "font-montserrat text-2xl font-semibold mb-2",
          "max-sm:text-lg"
        )}
      >
        {label}
      </h1>
      {children}
    </div>
  );
};

export default OverviewCardWrapper;
