import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import QuickStats from "@/components/ui/dashboard/stats/QuickStats";
import StatFields from "@/libs/constants/dashboard/statFields";

const Overview = () => {
  const { overviewStats } = StatFields();
  return (
    <>
      <PageTitle isDashboard />
      <QuickStats stats={overviewStats} />
    </>
  );
};

export default Overview;
