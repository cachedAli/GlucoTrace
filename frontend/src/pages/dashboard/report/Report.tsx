import PageTitle from "@/components_temp/layout/dashboard/mainContent/PageTitle";
import GenerateReport from "./components/GenerateReport";
import TimeRange from "./components/TimeRange";

const Report = () => {
  return (
    <>
      <PageTitle
        title="Glucose Report"
        subTitle="Download or share your glucose data summary."
      />
      <TimeRange />
      <GenerateReport />
    </>
  );
};

export default Report;
