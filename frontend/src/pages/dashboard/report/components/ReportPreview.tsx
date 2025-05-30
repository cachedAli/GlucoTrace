import { FileText } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";

import ReportCardsSkeleton from "@/components/ui/skeleton/CardsSkeleton";
import { useReadingStore } from "@/store/useReadingStore";
import { logobase64Dark } from "@/assets/logobase64Dark";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";
import { logoBase64 } from "@/assets/logobase64";

const ReportPreview = ({ data }: { data: any }) => {
  const user = useUserStore((state) => state.user);
  const { fetchReadingLoading } = useReadingStore();
  const { darkMode } = useThemeStore();
  return (
    <div className="flex items-center justify-center">
      <div
        className={clsx(
          "p-8 text-[12px] font-inter w-[800px] text-black bg-white border-2 border-dashed border-black rounded-2xl",
          "dark:bg-gray-800 dark:border-gray-300 dark:text-white",
          " max-lg:w-[700px] max-md:w-[600px] max-sm:w-full"
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            "relative mb-5 pb-2 border-b border-gray-800",
            "dark:border-gray-200"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Glucose Report</h2>
              <p
                className={clsx("text-sm text-gray-700", "dark:text-gray-200")}
              >
                <span
                  className={clsx(
                    "font-semibold text-gray-800",
                    "dark:text-gray-100"
                  )}
                >
                  Patient:
                </span>{" "}
                {data.patientName || "--"}
              </p>
              <p
                className={clsx("text-sm text-gray-700", "dark:text-gray-200")}
              >
                <span
                  className={clsx(
                    "font-semibold text-gray-800",
                    "dark:text-gray-100"
                  )}
                >
                  Diabetes:
                </span>{" "}
                {data.diabetesType || "--"} |{" "}
                <span
                  className={clsx(
                    "font-semibold text-gray-800",
                    "dark:text-gray-100"
                  )}
                >
                  Gender:
                </span>{" "}
                {data.gender || "--"} |
                <span
                  className={clsx(
                    "font-semibold text-gray-800",
                    "dark:text-gray-100"
                  )}
                >
                  {" "}
                  Age:
                </span>{" "}
                {data.age || "--"}
              </p>
              <p
                className={clsx("text-sm text-gray-700", "dark:text-gray-200")}
              >
                <span
                  className={clsx(
                    "font-semibold text-gray-800",
                    "dark:text-gray-100"
                  )}
                >
                  Diagnosed on:{" "}
                </span>
                {data.diagnosedDate
                  ? format(new Date(data.diagnosedDate), "MMMM d yyyy")
                  : "--"}
              </p>
              <p
                className={clsx("text-sm text-gray-700", "dark:text-gray-200")}
              >
                <span
                  className={clsx(
                    "font-semibold text-gray-800",
                    "dark:text-gray-100"
                  )}
                >
                  Date Range:
                </span>{" "}
                {data.range}
              </p>
              <p
                className={clsx("text-sm text-gray-700", "dark:text-gray-200")}
              >
                <span
                  className={clsx(
                    "font-semibold text-gray-800",
                    "dark:text-gray-100"
                  )}
                >
                  Date Generated:
                </span>{" "}
                {format(new Date(data.generatedDate), "MMMM d yyyy")}
              </p>
            </div>
            <img
              src={user?.darkMode ? logobase64Dark : logoBase64}
              className="w-[120px] h-[60px] object-contain"
              alt="Logo"
            />
          </div>
          <div className="absolute -right-2 -top-3">
            <FileText className="text-gray-600 dark:text-gray-200" />
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-bold mb-2">Summary</h3>
          <div className="flex flex-wrap gap-2">
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Average
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={25}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.avgGlucose || "--"
                )}{" "}
                {data.avgGlucose ? (
                  fetchReadingLoading ? (
                    <ReportCardsSkeleton
                      height={15}
                      width={50}
                      inline
                      report
                      darkMode={darkMode}
                    />
                  ) : (
                    data.unit
                  )
                ) : (
                  ""
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Time in Range
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={35}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.timeInRange
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Lows
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={20}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.totalLows
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Highs
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={20}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.totalHighs
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Est. HbA1C
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={35}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.a1c
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Readings
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={30}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.readings
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Meal Timing Summary */}
        <div>
          <h3 className="text-[14px] font-bold mb-2">Meal Timing Summary</h3>
          <div className="flex flex-wrap gap-2">
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Before Meals
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={25}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.beforeMeals || "--"
                )}{" "}
                {data.beforeMeals ? (
                  fetchReadingLoading ? (
                    <ReportCardsSkeleton
                      height={15}
                      width={50}
                      inline
                      report
                      darkMode={darkMode}
                    />
                  ) : (
                    data.unit
                  )
                ) : (
                  ""
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                After Meals
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={25}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.afterMeals || "--"
                )}{" "}
                {data.afterMeals ? (
                  fetchReadingLoading ? (
                    <ReportCardsSkeleton
                      height={15}
                      width={50}
                      inline
                      report
                      darkMode={darkMode}
                    />
                  ) : (
                    data.unit
                  )
                ) : (
                  ""
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Fasting
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={25}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.fasting || "--"
                )}{" "}
                {data.fasting ? (
                  fetchReadingLoading ? (
                    <ReportCardsSkeleton
                      height={15}
                      width={50}
                      inline
                      report
                      darkMode={darkMode}
                    />
                  ) : (
                    data.unit
                  )
                ) : (
                  ""
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Most Highs
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={80}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.mostHighMealTime || "--"
                )}
              </p>
            </div>
            <div
              className={clsx(
                "bg-gray-200 rounded-md p-3 w-[45%]",
                "dark:bg-gray-700"
              )}
            >
              <p
                className={clsx(
                  "text-[10px] text-gray-600 mb-1",
                  "dark:text-gray-100"
                )}
              >
                Most Lows
              </p>
              <p className="text-[14px] font-bold">
                {fetchReadingLoading ? (
                  <ReportCardsSkeleton
                    height={14}
                    width={80}
                    inline
                    report
                    darkMode={darkMode}
                  />
                ) : (
                  data.mostLowMealTime || "--"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
