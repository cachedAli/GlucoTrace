import clsx from "clsx";

import LineChart from "./LineChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

const TrendCharts = () => {
  return (
    <div className="flex flex-col gap-4 mt-4 ">
      <LineChart view="month" />

      <div className={clsx("flex gap-4 ", "max-sm:flex-col")}>
        <div className={clsx("w-1/2 max-xl:flex-1", "max-sm:w-full")}>
          <BarChart />
        </div>
        <div className={clsx("w-1/2 max-xl:flex-1", "max-sm:w-full")}>
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default TrendCharts;
