import PageTitle from "@/components_temp/layout/dashboard/mainContent/PageTitle";
import TrendCharts from "@/components_temp/ui/dashboard/charts/TrendCharts";
import QuickStats from "@/components_temp/ui/dashboard/stats/QuickStats";
import StatFields from "@/libs/constants/dashboard/statFields";

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
