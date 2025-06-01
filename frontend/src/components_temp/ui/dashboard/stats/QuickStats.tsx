import clsx from "clsx";

import { StateProps } from "@/types/dashboardTypes";
import StateCard from "./StateCard";

const QuickStats = ({ stats }: { stats: StateProps[] }) => {
  return (
    <div className={clsx("flex gap-6", "max-sm:flex-col", "max-lg:flex-wrap")}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={clsx(
            "flex flex-1 max-w-[300px]",
            "max-sm:flex-col max-sm:max-w-full",
            "max-lg:max-w-full",
            index === 0 && "w-full basis-full max-sm:basis-0"
          )}
        >
          <StateCard index={index} {...stat} />
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
