import React from "react";
import clsx from "clsx";

import OverviewStateCardSkeleton from "./FullStatCardSkeleton";
import PageTitleSkeleton from "./PageTitleSkeleton";


const OtherPagesSkeleton = () => {
  return (
    <div
      className={clsx(
        "flex-1 px-12 ml-20 flex flex-col gap-3 mb-6",
        "max-lg:ml-0 max-lg:px-0 max-lg:mb-28"
      )}
    >
      <PageTitleSkeleton />{" "}
      <div
        className={clsx("flex gap-6", "max-sm:flex-col", "max-lg:flex-wrap")}
      >
        {Array(3)
          .fill(0)
          .map?.((_: any, index: number) => (
            <div
              key={index}
              className={clsx(
                "flex flex-1 max-w-[300px]",
                "max-sm:flex-col max-sm:max-w-full",
                "max-lg:max-w-full",
                index === 0 && "w-full basis-full max-sm:basis-0"
              )}
            >
              <OverviewStateCardSkeleton index={index} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default OtherPagesSkeleton;
