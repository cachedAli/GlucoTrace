import { useDashboardStore } from "@/store/useDashboardStore";
import { useReadingStore } from "@/store/useReadingStore";
import { useUserStore } from "@/store/useUserStore";
import {
  filterReadingsByDate,
  generateReportData,
  getDateRange,
} from "@/libs/utils/reportUtils";
import { capitalizeFirstLetter } from "@/libs/utils/utils";
import ReportPreview from "./ReportPreview";
import ActionButtons from "./ActionButtons";

const GenerateReport = () => {
  const { timeRange, startDate, endDate } = useDashboardStore();
  const readings = useReadingStore((state) => state.readings);
  const user = useUserStore((state) => state.user);
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";
  const targetRange = user?.medicalProfile?.targetBloodSugarRange;

  const dateRange = getDateRange(
    timeRange,
    startDate ? startDate.toDate() : undefined,
    endDate ? endDate.toDate() : undefined
  );

  // Filter readings
  const filteredReadings = filterReadingsByDate(
    readings,
    dateRange.start,
    dateRange.end
  );

  // Generate report data
  const reportData = generateReportData(
    filteredReadings,
    dateRange.label,
    unit,
    targetRange,
   capitalizeFirstLetter(`${user?.firstName || ""} ${user?.lastName || ""}`),
    user?.medicalProfile?.diabetesType || "Type 2",
    user?.medicalProfile?.gender || "Other",
    user?.medicalProfile?.age?.toString() || "--"
  );

  return (
    <>
      <ReportPreview data={reportData} />

      <ActionButtons data={reportData} />
    </>
  );
};

export default GenerateReport;
