import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import TrendCharts from "@/components/ui/dashboard/charts/TrendCharts";
import QuickStats from "@/components/ui/dashboard/stats/QuickStats";
import StatFields from "@/libs/constants/dashboard/statFields.js";

const Trends = () => {
  const { trendStats } = StatFields();

  return (
    <>
      <PageTitle
        title="Glucose Trends"
        subTitle="See patterns in your glucose levels over time."
      />

      <QuickStats stats={trendStats} />

      <TrendCharts />
    </>
  );
};

export default Trends;
