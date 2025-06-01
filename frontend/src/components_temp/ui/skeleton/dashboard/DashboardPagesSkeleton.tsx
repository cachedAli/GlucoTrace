import React from "react";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

import OverviewFullCardSkeleton from "../overviewPage/OverviewFullCardSkeleton";
import FullStatCardSkeleton from "../dashboardPages/FullStatCardSkeleton";
import HistoryCardSkeleton from "../overviewPage/HistoryCardSkeleton";
import PageTitleSkeleton from "../dashboardPages/PageTitleSkeleton";
import ChartSkeleton from "../overviewPage/ChartSkeleton";
import TimeRangeSkeleton from "../dashboardPages/TimeRangeSkeleton";

const DashboardPagesSkeleton = () => {
  const location = useLocation();
  const isOverviewPage = location.pathname === "/dashboard";
  const isSettingsPage = location.pathname === "/dashboard/settings";
  const isReportPage = location.pathname === "/dashboard/report";
  const isProfilePage = location.pathname === "/dashboard/profile";
  const nonStatCardPages = isSettingsPage || isReportPage || isProfilePage;

  return (
    <>
      <PageTitleSkeleton /> {isReportPage && <TimeRangeSkeleton />}
      {!nonStatCardPages && (
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
                <FullStatCardSkeleton index={index} />
              </div>
            ))}
        </div>
      )}
      {!nonStatCardPages && isOverviewPage && (
        <>
          <div className="flex flex-col gap-4 mt-4 ">
            <ChartSkeleton />
          </div>
          <div className={clsx("flex w-full gap-4", "max-md:flex-col")}>
            <div className={clsx("w-1/2 flex flex-col gap-4", "max-md:w-full")}>
              <OverviewFullCardSkeleton type="addReading" />
              <OverviewFullCardSkeleton type="download" />
            </div>
            <div className={clsx("w-1/2", "max-md:w-full")}>
              <HistoryCardSkeleton />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardPagesSkeleton;
