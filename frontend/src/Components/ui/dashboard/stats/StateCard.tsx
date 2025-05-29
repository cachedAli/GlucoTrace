import { TrendingDown, TrendingUp } from "lucide-react";
import clsx from "clsx";

import { StateProps } from "@/types/dashboardTypes";

const StateCard = ({ index, ...props }: { index: number } & StateProps) => {
  return (
    <div
      className={clsx(
        "py-4 px-3 w-full min-w-60 max-w-[300px] flex-1 shadow-md h-40 sha rounded-xl flex flex-col justify-between",
        "max-lg:max-w-full",
        index === 0 && "max-lg:max-w-full max-lg:w-full",
        index === 0
          ? "bg-gradient-to-b from-secondary/90 to-primary dark:bg-gradient-to-b dark:from-blue-700/90 dark:from-[0] dark:to-indigo-700"
          : "bg-blue-100 border border-blue-200 dark:bg-blue-200 dark:border-blue-300"
      )}
    >
      <StateCardTopRow {...props} index={index} />
      <StateCardContent {...props} index={index} />
    </div>
  );
};

const StateCardTopRow = ({
  icon: Icon,
  isOverview,
  trend,
  title,
  index,
}: StateProps & { index: number }) => {
  return (
    <div
      className={clsx(
        "flex items-center",
        !isOverview
          ? "justify-between gap-2 flex-row-reverse"
          : "justify-between"
      )}
    >
      {/* Icon */}
      <span
        className={clsx(
          "bg-indigo-600 text-gray-100 p-2 rounded-full",
          index === 0 &&
            "!bg-slate-50 text-indigo-600 dark:!bg-gray-900 dark:text-accent/95"
        )}
      >
        {Icon && <Icon className="size-5" />}
      </span>

      {/* Trend */}
      {!isOverview && (
        <h1
          className={clsx(
            "text-sm  font-montserrat",
            index !== 0 ? "text-black font-semibold" : "text-white font-medium"
          )}
        >
          {title}
        </h1>
      )}
      {isOverview && trend && (
        <TrendIndicator trend={trend} index={index} title={title} />
      )}
    </div>
  );
};

const StateCardContent = ({
  title,
  value,
  description,
  timeFrame,
  isOverview,
  bgIcon: BgIcon,
  trend,
  index,
  isSplitStat,
  secondValue,
  splitStat1,
  splitStat2,
}: StateProps & { index: number }) => {
  const textColor = index !== 0 ? "text-gray-800" : "text-white";

  return (
    <div className={clsx("flex flex-col gap-1", textColor)}>
      {/* Background Icon */}
      {isOverview && BgIcon && <BackgroundIcon BgIcon={BgIcon} index={index} />}

      {isOverview ? (
        <>
          <h1 className="text-xs font-semibold">{title}</h1>
          <h2 className="font-semibold text-2xl">{value}</h2>

          <p className={clsx("text-xs", textColor)}>{timeFrame}</p>
        </>
      ) : (
        <>
          <p
            className={clsx(
              "text-xs",
              index !== 0 ? "text-gray-800" : "text-gray-200"
            )}
          >
            {timeFrame}
          </p>
          <div className="flex items-center w-full justify-between">
            {isSplitStat ? (
              <h2 className="font-semibold text-base">
                {splitStat1}:{" "}
                <span className="font-semibold text-2xl">{value}</span> /{" "}
                {splitStat2}:{" "}
                <span className="font-semibold text-2xl">{secondValue}</span>
              </h2>
            ) : (
              <h2 className="font-semibold text-2xl">{value}</h2>
            )}
            {trend && (
              <TrendIndicator trend={trend} index={index} title={title} />
            )}
          </div>
          <p
            className={clsx(
              "text-xs",
              index !== 0 ? "text-gray-800" : "text-gray-200"
            )}
          >
            {description}
          </p>
        </>
      )}
    </div>
  );
};

const BackgroundIcon = ({
  BgIcon,
  index,
}: {
  BgIcon: React.ComponentType<{ className?: string }>;
  index: number;
}) => (
  <div className="relative">
    <div className="absolute -bottom-[58px] max-sm:-bottom-[65px] -right-1">
      <BgIcon
        className={clsx(
          "size-16",
          index !== 0 ? "text-blue-600/30" : "text-blue-400/30"
        )}
      />
    </div>
  </div>
);

const TrendIndicator = ({
  trend,
  index,
  title,
}: {
  trend: string | number;
  index: number;
  title: string;
}) => {
  const isNegative = typeof trend === "string" && trend.includes("-");
  const isHighLow = title === "High/Low Episodes";
  const isMorningEvening = title === "Morning vs. Evening Averages";
  const isSpecialTitle = isHighLow || isMorningEvening;

  const isPositiveForSpecial = isSpecialTitle ? isNegative : !isNegative;

  return (
    <div
      className={clsx(
        "flex items-center gap-2 px-2 py-0.5 rounded-2xl border",
        index !== 0
          ? isPositiveForSpecial
            ? "bg-green-400 border-green-500 text-gray-800"
            : "bg-red-500/90 border-red-600 text-gray-100"
          : isPositiveForSpecial
          ? "bg-green-300 border-green-500 text-gray-800"
          : "bg-red-400 border-red-500 text-gray-800"
      )}
    >
      {isPositiveForSpecial ? (
        <TrendingUp className="size-4" />
      ) : (
        <TrendingDown className="size-4" />
      )}
      <h2 className="text-[10px] font-semibold">{trend}</h2>
    </div>
  );
};

export default StateCard;
