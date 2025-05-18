import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import QuickStats from "@/components/ui/dashboard/stats/QuickStats";
import LineChart from "@/components/ui/dashboard/charts/LineChart";
import StatFields from "@/libs/constants/dashboard/statFields";
import QuickAccessCards from "./components/QuickAccessCards";

const Overview = () => {
  const { overviewStats } = StatFields();
  return (
    <>
      <PageTitle isDashboard />
      <QuickStats stats={overviewStats} />

      <div className="mt-4">
        <LineChart view="week" />
      </div>

      <QuickAccessCards />
    </>
  );
};

export default Overview;
