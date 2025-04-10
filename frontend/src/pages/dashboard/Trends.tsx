import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import StatFields from "@/libs/constants/dashboard/statFields";

const Trends = () => {
  const {overviewStats} = StatFields();

  return (
    <div>
      <PageTitle
        title="Glucose Trends"
        subTitle="See patterns in your glucose levels over time."
      />
    </div>
  );
};

export default Trends;
