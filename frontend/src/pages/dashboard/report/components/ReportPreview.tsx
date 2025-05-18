import { FileText } from "lucide-react";
import { format } from "date-fns";

import { logoBase64 } from "@/assets/logobase64";

const ReportPreview = ({ data }: { data: any }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="p-8 text-[12px] font-inter w-[800px] max-lg:w-[700px] max-md:w-[600px] max-sm:w-full text-black bg-white border-2 border-dashed border-black dark: rounded-2xl">
        {/* Header */}
        <div className="relative mb-5 pb-2 border-b border-gray-800">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Glucose Report</h2>
              <p className="text-sm text-gray-700">
                Patient: {data.patientName || "--"}
              </p>
              <p className="text-sm text-gray-700">
                Type: {data.diabetesType || "--"} | Gender:{" "}
                {data.gender || "--"} | Age: {data.age || "--"}
              </p>
              <p className="text-sm text-gray-700">Date Range: {data.range}</p>
              <p className="text-sm text-gray-700">
                Date Generated:{" "}
                {format(new Date(data.generatedDate), "MMMM d yyyy")}
              </p>
            </div>
            <img
              src={logoBase64}
              className="w-[120px] h-[60px] object-contain"
              alt="Logo"
            />
          </div>
          <div className="absolute -right-2 -top-3">
            <FileText className="text-gray-600" />
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-bold mb-2">Summary</h3>
          <div className="flex flex-wrap gap-2">
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Average</p>
              <p className="text-[14px] font-bold">
                {data.avgGlucose || "--"} {data.avgGlucose ? data.unit : ""}
              </p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Time in Range</p>
              <p className="text-[14px] font-bold">{data.timeInRange}</p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Lows</p>
              <p className="text-[14px] font-bold">{data.totalLows}</p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Highs</p>
              <p className="text-[14px] font-bold">{data.totalHighs}</p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Est. HbA1C</p>
              <p className="text-[14px] font-bold">{data.a1c}</p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Readings</p>
              <p className="text-[14px] font-bold">{data.readings}</p>
            </div>
          </div>
        </div>

        {/* Meal Timing Summary */}
        <div>
          <h3 className="text-[14px] font-bold mb-2">Meal Timing Summary</h3>
          <div className="flex flex-wrap gap-2">
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Before Meals</p>
              <p className="text-[14px] font-bold">
                {data.beforeMeals || "--"} {data.beforeMeals ? data.unit : ""}
              </p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">After Meals</p>
              <p className="text-[14px] font-bold">
                {data.afterMeals || "--"} {data.afterMeals ? data.unit : ""}
              </p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Fasting</p>
              <p className="text-[14px] font-bold">
                {data.fasting || "--"} {data.fasting ? data.unit : ""}
              </p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Most Highs</p>
              <p className="text-[14px] font-bold">
                {data.mostHighMealTime || "--"}
              </p>
            </div>
            <div className="bg-gray-200 rounded-md p-3 w-[45%]">
              <p className="text-[10px] text-gray-600 mb-1">Most Lows</p>
              <p className="text-[14px] font-bold">
                {data.mostLowMealTime || "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
