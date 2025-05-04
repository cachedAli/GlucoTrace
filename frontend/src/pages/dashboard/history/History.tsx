import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import QuickStats from "@/components/ui/dashboard/stats/QuickStats";
import StatFields from "@/libs/constants/dashboard/statFields";
import ActionButtons from "./ActionButtons";
import ReadingTable from "./ReadingTable";

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
