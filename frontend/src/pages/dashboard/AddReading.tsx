import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import { addReadingSchema } from "@/libs/validations/dashboardSchema";
import QuickStats from "@/components/ui/dashboard/stats/QuickStats";
import StatFields from "@/libs/constants/dashboard/statFields";
import { addReadingFields } from "@/libs/constants/dashboard";
import { useReadingStore } from "@/store/useReadingStore";
import { useUserStore } from "@/store/useUserStore";
import Form from "@/components/ui/common/Form";
import { Unit } from "@/types/dashboardTypes";

type Data = {
  glucose: number;
  mealTiming: "Before Meal" | "After Meal" | "Fasting" | { custom: string };
  date: string;
  time: string;
  note: string;
};
const AddReading = () => {
  const { user } = useUserStore();
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";
  const { setReadings, addReading, addReadingLoading } = useReadingStore();
  const { addReadingStats } = StatFields();

  const convertToMgdl = (value: number, unit: Unit) => {
    return unit === "mmol/L" ? Math.round(value * 18.0182) : Math.round(value);
  };

  const handleSubmit = async (data: Data) => {
    if (!user) return;

    const { glucose, mealTiming, date, time, note } = data;
    const timestamp = mergeDateAndTime(date, time);

    const response = await addReading({
      value: convertToMgdl(Number(glucose), unit),
      mealTiming,
      timestamp,
      note,
    });

    if (response) {
      return true;
    }
    return;
  };

  const mergeDateAndTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(":");
    dateObj.setHours(Number(hours));
    dateObj.setMinutes(Number(minutes));

    const timestamp = dateObj.toISOString();
    return timestamp;
  };
  return (
    <>
      <PageTitle
        title="Add Glucose Reading"
        subTitle="Track your glucose levels in real-time."
      />
      <QuickStats stats={addReadingStats} />

      <div className="mt-3">
        <Form
          fields={addReadingFields}
          schema={addReadingSchema}
          buttonLabel="Confirm"
          onSubmit={handleSubmit}
          googleAuth={false}
          buttonClassName="w-96 max-sm:w-full"
          buttonAlignment="end"
          loading={addReadingLoading}
        />
      </div>
    </>
  );
};

export default AddReading;
