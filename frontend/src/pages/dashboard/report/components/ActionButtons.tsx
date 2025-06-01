import { Download, Mail, Share } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import { useDashboardStore } from "@/store/useDashboardStore";
import Button from "@/components_temp/ui/common/Button";
import GlucoseReportPDF from "./GenerateReportPdf";

const ActionButtons = ({ data }: any) => {
  const setShowShareReportModal = useDashboardStore(
    (state) => state.setShowShareReportModal
  );
  const convertReportDataToCSV = (data: any) => {
    const headers = [
      "Patient Name",
      "Date Range",
      "Generated Date",
      "Average Glucose",
      "Time In Range",
      "Total Readings",
      "Estimated A1C",
      "Before Meals Avg",
      "After Meals Avg",
      "Fasting Avg",
      "Most High Meal Time",
      "Most Low Meal Time",
      "Total Highs",
      "Total Lows",
      "Unit",
    ];

    const values = [
      data.patientName,
      data.range,
      new Date(data.generatedDate).toLocaleString(),
      data.avgGlucose,
      data.timeInRange,
      data.readings,
      data.a1c,
      data.beforeMeals,
      data.afterMeals,
      data.fasting,
      data.mostHighMealTime,
      data.mostLowMealTime,
      data.totalHighs,
      data.totalLows,
      data.unit,
    ];

    const escapedValues = values.map((val) =>
      typeof val === "string" && val.includes(",") ? `"${val}"` : val
    );

    return `${headers.join(",")}\n${escapedValues.join(",")}`;
  };

  const handleDownloadCSV = () => {
    const csv = convertReportDataToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "glucose_report.csv");
  };

  const handleDownload = async () => {
    const blob = await pdf(<GlucoseReportPDF data={data} />).toBlob();
    saveAs(blob, "glucose_report.pdf");
  };

  const handleSharePdf = async () => {
    try {
      // Generate the PDF blob
      const blob = await pdf(<GlucoseReportPDF data={data} />).toBlob();

      // Convert blob to a File object (required by Web Share API)
      const file = new File([blob], "glucose_report.pdf", {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Glucose Report",
          text: "Please check out my glucose report.",
          files: [file],
        });
        console.log("Shared successfully");
      } else {
        alert("Sharing files is not supported on this device/browser.");
      }
    } catch (error) {
      console.error("Error sharing the PDF", error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
      <Button onClick={handleDownload} variant="fill">
        <Download size={20} /> Download PDF
      </Button>

      <Button onClick={handleDownloadCSV} variant="fill">
        <Download size={20} /> Download CSV
      </Button>

      <Button onClick={handleSharePdf}>
        {" "}
        <Share size={20} />
        Share Report
      </Button>

      <Button onClick={() => setShowShareReportModal(true)}>
        <Mail size={20} />
        Share Report by Email
      </Button>
    </div>
  );
};

export default ActionButtons;
