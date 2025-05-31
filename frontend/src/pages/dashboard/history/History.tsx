import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import QuickStats from "@/components/ui/dashboard/stats/QuickStats";
import StatFields from "@/libs/constants/dashboard/statFields.js";
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
