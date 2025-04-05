import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import { overviewStats } from "@/libs/constants/dashboard/statFields";
import QuickStats from "@/components/ui/dashboard/stats/QuickStats";


const Overview = () => {
  return (
    <>
      <PageTitle isDashboard />
      <QuickStats stats={overviewStats} />
    </>
  );
};

export default Overview;
