import clsx from "clsx";

import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Download, Plus } from "lucide-react";

import OverviewCard from "@/components_temp/ui/dashboard/OverviewCard";
import {
  estimateHba1c,
  getMonthChange,
  getMonthlyStats,
} from "@/libs/utils/statFieldUtils";
import {
  capitalizeFirstLetter,
  convertToMmol,
  getReadingStatus,
  getStatusColorClass,
} from "@/libs/utils/utils";
import { TargetRange, Unit } from "@/types/dashboardTypes";
import { useReadingStore } from "@/store/useReadingStore";
import { useUserStore } from "@/store/useUserStore";
import { Reading } from "@/types/userTypes";
import HistoryCard from "./HistoryCard";
import { useStats } from "@/providers/StatsProvider";

type CardProps = {
  readings: Reading[];
  unit: Unit;
  targetRange: TargetRange;
  navigate: (path: string) => void;
};

const QuickAccessCards = () => {
  const readings = useReadingStore((state) => state.readings);
  const user = useUserStore((state) => state.user);
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";
  const targetRange = user?.medicalProfile?.targetBloodSugarRange || {
    min: 70,
    max: 180,
  };

  const navigate = useNavigate();

  const cardProps = { readings, unit, targetRange, navigate };

  return (
    <div className={clsx("flex w-full gap-4", "max-md:flex-col")}>
      <div className={clsx("w-1/2 flex flex-col gap-4", "max-md:w-full")}>
        <AddReadingCard {...cardProps} />
        <DownloadReportCard {...cardProps} />
      </div>
      <div className={clsx("w-1/2", "max-md:w-full")}>
        <HistoryCard />
      </div>
    </div>
  );
};

export default QuickAccessCards;

const AddReadingCard = ({
  readings,
  unit,
  targetRange,
  navigate,
}: CardProps) => {
  const getLastReadingInfo = (
    readings: Reading[],
    unit: Unit,
    targetRange: TargetRange
  ) => {
    const lastReading = readings[0];

    if (!lastReading) {
      return {
        value: "--",
        message: <span className="text-gray-500">No readings</span>,
        timeFrame: "No recent reading",
      };
    }

    const { timestamp, value } = lastReading;
    const relativeTime = formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
    });

    const statusMessage = getReadingStatus(value, unit, targetRange);
    const messageColor = getStatusColorClass(statusMessage.status, false, true);
    const formattedValue = String(convertToMmol(value, unit));

    return {
      value: formattedValue,
      message: (
        <span className={clsx(messageColor)}>
          {capitalizeFirstLetter(statusMessage.status)}
        </span>
      ),
      timeFrame: relativeTime,
    };
  };

  const { value, message, timeFrame } = getLastReadingInfo(
    readings,
    unit,
    targetRange
  );

  return (
    <OverviewCard
      type="addReading"
      label="Last Reading"
      buttonLabel={
        <span className="flex items-center gap-2">
          <Plus size={20} />
          Add Reading
        </span>
      }
      value={value}
      message={message}
      timeFrame={timeFrame}
      onClick={() => navigate("/dashboard/add-reading")}
    />
  );
};

const DownloadReportCard = ({
  readings,
  unit,
  targetRange,
  navigate,
}: CardProps) => {
  const { stats } = useStats();

  const prevMonthlyChange = stats.monthlyChange;
  const prevTargetRangeStats = stats.targetRange;

  const monthlyChangeStats = getMonthChange(readings, prevMonthlyChange, unit);

  const monthlyTargetRangeStats = getMonthlyStats(
    readings,
    prevTargetRangeStats,
    unit,
    targetRange
  );

  const HbA1c = estimateHba1c(readings, unit);

  const formatChangeSymbol = (value: string) => {
    if (value.startsWith("↑")) return `+${value.slice(1)}`;
    if (value.startsWith("↓")) return `-${value.slice(1)}`;
    return value;
  };

  const downloadReportData = [
    {
      label: "Average glucose change",
      value: formatChangeSymbol(monthlyChangeStats.value),
    },
    { label: "Readings in target range", value: monthlyTargetRangeStats.value },
    { label: "HbA1c", value: HbA1c.value },
  ];
  return (
    <OverviewCard
      type="download"
      label="Download Monthly Report"
      buttonLabel={
        <span className="flex items-center gap-2">
          <Download size={20} />
          Download Report
        </span>
      }
      insight={downloadReportData}
      onClick={() => navigate("/dashboard/report")}
    />
  );
};
