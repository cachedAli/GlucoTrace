import PageTitle from "@/components_temp/layout/dashboard/mainContent/PageTitle";
import QuickStats from "@/components_temp/ui/dashboard/stats/QuickStats";
import StatFields from "@/libs/constants/dashboard/statFields";
import ActionButtons from "./components/ActionButtons";
import ReadingTable from "./components/ReadingTable";

const History = () => {
  const { readingsHistoryStats } = StatFields();
  return (
    <>
      <PageTitle
        title="Glucose History"
        subTitle="Review your past readings and insights."
      />
      <QuickStats stats={readingsHistoryStats} />

      <ActionButtons />

      <ReadingTable />
    </>
  );
};

export default History;
