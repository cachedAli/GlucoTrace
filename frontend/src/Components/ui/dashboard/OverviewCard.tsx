import React from "react";
import clsx from "clsx";

import OverviewCardWrapper from "./wrapper/OverviewCardWrapper";
import Button from "../common/Button";
import { useReadingStore } from "@/store/useReadingStore";
import { useThemeStore } from "@/store/useThemeStore";
import OverviewCardsSkeleton from "../skeleton/CardsSkeleton";

type InsightItem = {
  label: string;
  value: string;
};

type AddReadingItems = {
  value: string;
  timeFrame: string;
  message: JSX.Element;
};

interface AddReadingProps extends AddReadingItems {
  type: "addReading";
}

interface DownloadReportProps {
  type: "download";
  insight: InsightItem[];
}

type OverviewCardProps =
  | ({
      onClick: () => void;
      buttonLabel: JSX.Element;
      label: string;
    } & AddReadingProps)
  | ({
      onClick: () => void;
      buttonLabel: JSX.Element;
      label: string;
    } & DownloadReportProps);

const OverviewCard = (props: OverviewCardProps) => {
  return (
    <OverviewCardWrapper label={props.label}>
      {props.type === "addReading" ? (
        <AddReading
          value={props.value}
          timeFrame={props.timeFrame}
          message={props.message}
        />
      ) : (
        <Download insight={props.insight} />
      )}

      <Button variant="fill" onClick={props.onClick} type="button">
        {props.buttonLabel}
      </Button>
    </OverviewCardWrapper>
  );
};

export default OverviewCard;

const AddReading = ({ value, timeFrame, message }: AddReadingItems) => {
  const [number, unit] = value?.split(" ") ?? [];
  const { fetchReadingLoading } = useReadingStore();
  const { darkMode } = useThemeStore();

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-3xl font-semibold">
        {fetchReadingLoading ? (
          <OverviewCardsSkeleton
            height={34}
            width={60}
            inline
            darkMode={darkMode}
          />
        ) : (
          number
        )}{" "}
        <span className="text-lg">
          {fetchReadingLoading ? (
            <OverviewCardsSkeleton height={23} width={65} darkMode={darkMode} />
          ) : (
            unit
          )}
        </span>
      </h2>

      <h2 className={clsx("text-sm text-gray-600", "dark:text-gray-300")}>
        {fetchReadingLoading ? (
          <OverviewCardsSkeleton height={15} width={133} darkMode={darkMode} />
        ) : (
          timeFrame
        )}
      </h2>

      <p className="font-semibold">
        {fetchReadingLoading ? (
          <OverviewCardsSkeleton height={15} width={80} darkMode={darkMode} />
        ) : (
          message
        )}
      </p>
    </div>
  );
};

const Download = ({ insight }: { insight: InsightItem[] }) => {
  const { fetchReadingLoading } = useReadingStore();
  const { darkMode } = useThemeStore();

  return (
    <div className="flex flex-col gap-2">
      {insight?.map((item, index) => (
        <div key={index} className="w-full flex items-center justify-between">
          <h2
            className={clsx(
              "text-gray-800",
              "dark:text-gray-300",
              "max-sm:text-sm"
            )}
          >
            {item.label}:
          </h2>
          <h2
            className={clsx(
              "font-semibold",
              item.value?.includes("-")
                ? "text-green-500"
                : item.value?.includes("+")
                ? "text-red-500"
                : ""
            )}
          >
            {fetchReadingLoading ? (
              <OverviewCardsSkeleton
                height={15}
                width={40}
                darkMode={darkMode}
              />
            ) : (
              item.value
            )}
          </h2>
        </div>
      ))}
    </div>
  );
};
