import { useState } from "react";
import clsx from "clsx";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { format } from "date-fns";

import {
  capitalizeFirstLetter,
  getStatusColorClass,
  getReadingStatus,
  convertToMmol,
} from "@/libs/utils/utils";
import TableSkeleton from "@/components/ui/skeleton/dashboardPages/TableSkeleton";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useReadingStore } from "@/store/useReadingStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";
import { Reading } from "@/types/userTypes";

const ReadingTable = () => {
  return (
    <div className="mt-3">
      <TableContainer sx={{ borderRadius: "16px" }}>
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table sx={{ minWidth: 950 }}>
              <TableHeadContent />
              <TableBodyContent />
            </Table>
          </Box>
        </Box>
      </TableContainer>
    </div>
  );
};

export default ReadingTable;

const TableHeadContent = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <TableHead
      sx={{
        backgroundImage: darkMode
          ? "linear-gradient(to bottom, rgba(29, 78, 216, 0.9), rgba(67, 56, 202, 1))"
          : "linear-gradient(to bottom, rgba(40, 53, 147, 0.9), #1a237e)",

        "& .MuiTableCell-root": {
          color: "#ffffff",
          fontWeight: "600",
          fontSize: "0.9rem",
          fontFamily: "Montserrat",
        },
      }}
    >
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Date</TableCell>
        <TableCell>Time</TableCell>
        <TableCell>Value</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Meal Timing</TableCell>
        <TableCell>Note</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>
  );
};

type TableBodyProps = {
  editId: string | null;
  editedReading: {
    value: string;
    date: string;
    time: string;
    note: string;
    mealTiming: "Before Meal" | "After Meal" | "Fasting" | { custom: string };
  };
  reading: Reading;
  globalInputStyles: string;
  setEditedReading: React.Dispatch<
    React.SetStateAction<{
      value: string;
      date: string;
      time: string;
      note: string;
      mealTiming: "Before Meal" | "After Meal" | "Fasting" | { custom: string };
    }>
  >;
};

const TableBodyContent = () => {
  const user = useUserStore((state) => state.user);
  const darkMode = useThemeStore((state) => state.darkMode);
  const range = user?.medicalProfile?.targetBloodSugarRange as {
    min: number;
    max: number;
  };
  const unit = user?.medicalProfile?.bloodSugarUnit ?? "mg/dL";

  const { filteredReadings } = useReadingStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [editedReading, setEditedReading] = useState<{
    value: string;
    date: string;
    time: string;
    note: string;
    mealTiming: "Before Meal" | "After Meal" | "Fasting" | { custom: string };
  }>({
    value: "",
    date: "",
    time: "",
    note: "",
    mealTiming: "Before Meal",
  });

  const globalInputStyles =
    "px-2 py-1 border outline-none border-[#d1d5db] dark:border-[rgba(255, 255, 255, 255)] rounded-lg hover:border-[#2563eb] focus:border-[#2563eb] font-inter dark:bg-gray-800";

  return (
    <TableBody
      sx={{
        border: "none",
        background: darkMode ? "#1f2937" : "",
        "& .MuiTableCell-root": {
          color: darkMode ? "#ffffff" : "",
          fontFamily: "Inter",
        },
      }}
    >
      {useReadingStore.getState().fetchReadingLoading ? (
        <TableSkeleton />
      ) : filteredReadings.length > 0 ? (
        filteredReadings.map((reading, index) => {
          const sharedProps = {
            editedReading,
            editId,
            globalInputStyles,
            reading,
            setEditedReading,
          };

          return (
            <TableRow key={reading.id}>
              <TableCell>{index + 1}</TableCell>
              <TableDate {...sharedProps} />
              <TableTime {...sharedProps} />
              <TableValue {...sharedProps} unit={unit} />
              <TableStatus {...sharedProps} range={range} unit={unit} />
              <TableMealTiming {...sharedProps} />
              <TableNote {...sharedProps} />
              <TableActionButtons {...sharedProps} setEditId={setEditId} />
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan={8}
            align="center"
            sx={{
              fontSize: "20px",
              borderBottom: "none",
              color: "#6B7280",
              py: 3,
            }}
          >
            Your readings will show up here once added.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

const TableDate = ({
  editId,
  editedReading,
  reading,
  globalInputStyles,
  setEditedReading,
}: TableBodyProps) => {
  const getTodayDateString = () => {
    return format(new Date(), "yyyy-MM-dd");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = getTodayDateString();

    if (selectedDate > today) {
      setEditedReading({ ...editedReading, date: today });
    } else {
      setEditedReading({ ...editedReading, date: selectedDate });
    }
  };

  return (
    <TableCell>
      {editId === reading.id ? (
        <input
          type="date"
          value={editedReading.date}
          onChange={handleDateChange}
          max={getTodayDateString()}
          className={clsx(globalInputStyles, "!w-[140px]")}
        />
      ) : (
        format(new Date(reading.timestamp), "MMMM d, yyyy")
      )}
    </TableCell>
  );
};

const TableTime = ({ ...props }: TableBodyProps) => {
  return (
    <TableCell>
      {props.editId === props.reading.id ? (
        <input
          type="time"
          value={props.editedReading.time}
          onChange={(e) =>
            props.setEditedReading({
              ...props.editedReading,
              time: e.target.value,
            })
          }
          className={clsx(props.globalInputStyles, "!w-[120px]")}
        />
      ) : (
        format(new Date(props.reading.timestamp), "hh:mm a")
      )}
    </TableCell>
  );
};

const TableValue = ({
  editId,
  editedReading,
  reading,
  globalInputStyles,
  setEditedReading,
  unit,
}: { unit: "mg/dL" | "mmol/L" } & TableBodyProps) => {
  return (
    <TableCell>
      {editId === reading.id ? (
        <input
          type="number"
          value={
            editedReading?.value
              ? unit === "mmol/L"
                ? Number(
                    convertToMmol(Number(editedReading.value), unit, false)
                  )
                : editedReading.value
              : ""
          }
          onChange={(e) => {
            const rawValue = e.target.value;
            const maxValue = unit === "mg/dL" ? 2000 : 110;
            const minValue = 1;

            if (
              rawValue === "" ||
              (!isNaN(Number(rawValue)) &&
                Number(rawValue) >= minValue &&
                Number(rawValue) <= maxValue)
            ) {
              const mgValue =
                unit === "mmol/L"
                  ? Math.round(Number(rawValue) * 18)
                  : Number(rawValue);

              setEditedReading({ ...editedReading, value: String(mgValue) });
            }
          }}
          onBlur={(e) => {
            if (e.target.value === "" || Number(e.target.value) < 1) {
              setEditedReading({ ...editedReading, value: "1" });
            }
          }}
          className={clsx(
            globalInputStyles,
            "w-12",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          min={1}
          max={unit === "mg/dL" ? 2000 : 110}
        />
      ) : (
        <>
          {Number(convertToMmol(reading.value, unit, false))} {unit}
        </>
      )}
    </TableCell>
  );
};

const TableMealTiming = ({
  editId,
  editedReading,
  reading,
  globalInputStyles,
  setEditedReading,
}: TableBodyProps) => {
  const MEAL_TIMING_OPTIONS = [
    "Before Meal",
    "After Meal",
    "Fasting",
    "Custom",
  ];
  return (
    <TableCell>
      {editId === reading.id ? (
        <div className="flex flex-col gap-2">
          <select
            value={
              typeof editedReading.mealTiming === "string"
                ? editedReading.mealTiming
                : "Custom"
            }
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "Before Meal" ||
                value === "After Meal" ||
                value === "Fasting"
              ) {
                setEditedReading({
                  ...editedReading,
                  mealTiming: value,
                });
              } else {
                setEditedReading({
                  ...editedReading,
                  mealTiming: {
                    custom:
                      typeof editedReading.mealTiming === "object"
                        ? editedReading.mealTiming.custom
                        : "",
                  },
                });
              }
            }}
            className={clsx(globalInputStyles, " !w-[120px]")}
          >
            {MEAL_TIMING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {typeof editedReading.mealTiming === "object" && (
            <input
              type="text"
              value={editedReading.mealTiming.custom}
              onChange={(e) =>
                setEditedReading({
                  ...editedReading,
                  mealTiming: {
                    custom: e.target.value,
                  },
                })
              }
              placeholder="Enter custom meal timing"
              className={clsx(globalInputStyles, "w-[120px]")}
              maxLength={25}
            />
          )}
        </div>
      ) : typeof reading.mealTiming === "string" ? (
        reading?.mealTiming
      ) : (
        reading?.mealTiming?.custom
      )}
    </TableCell>
  );
};

const TableStatus = ({
  reading,
  unit,
  range,
}: {
  reading: Reading;
  unit: "mg/dL" | "mmol/L";
  range: { min: number; max: number };
}) => {
  return (
    <TableCell>
      <div
        className={clsx(
          "rounded-full px-1 py-1 text-center text-xs text-white font-medium truncate",
          getStatusColorClass(
            getReadingStatus(reading.value, unit, range).status
          )
        )}
      >
        {capitalizeFirstLetter(
          getReadingStatus(reading.value, unit, range).status
        )}
      </div>
    </TableCell>
  );
};

const TableNote = ({
  editId,
  editedReading,
  reading,
  globalInputStyles,
  setEditedReading,
}: TableBodyProps) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <TableCell>
      {editId === reading.id ? (
        <textarea
          value={editedReading.note || ""}
          onChange={(e) =>
            setEditedReading({ ...editedReading, note: e.target.value })
          }
          className={clsx(
            globalInputStyles,
            "w-full min-h-[80px] resize-none hide-scrollbar"
          )}
          placeholder="Add a note..."
        />
      ) : reading?.note ? (
        reading.note.length > 20 ? (
          <Tooltip
            title={reading.note}
            open={tooltipOpen}
            onOpen={() => !isMobile && setTooltipOpen(true)}
            onClose={() => setTooltipOpen(false)}
            disableFocusListener={isMobile}
            disableHoverListener={isMobile}
            disableTouchListener={!isMobile}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: darkMode ? " #1e40af" : "#283593",
                  color: darkMode ? "#f9fafb" : "#ffffff",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  maxWidth: 300,
                  whiteSpace: "pre-wrap",
                },
              },
            }}
          >
            <span
              className="cursor-pointer"
              onClick={() => isMobile && setTooltipOpen(!tooltipOpen)}
            >
              {reading.note.slice(0, 20) + "..."}
            </span>
          </Tooltip>
        ) : (
          reading.note
        )
      ) : (
        "-"
      )}
    </TableCell>
  );
};

const TableActionButtons = ({
  editId,
  editedReading,
  reading,
  setEditedReading,
  setEditId,
}: {
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
} & TableBodyProps) => {
  const { setShowDeleteReading, setReadingToDelete } = useDashboardStore();
  const { updateReadings, filteredReadings, editReadingLoading } =
    useReadingStore();

  const handleUpdateReading = async (id: string) => {
    const mealTiming =
      typeof editedReading.mealTiming === "object" &&
      !editedReading.mealTiming.custom.trim();
    if (
      !editedReading.value ||
      !editedReading.date ||
      !editedReading.time ||
      mealTiming
    )
      return;

    try {
      // Find the existing reading to preserve other properties
      const existingReading = filteredReadings.find((r) => r.id === id);
      if (!existingReading) return;

      // Combine date and time into ISO string
      const dateTimeString = `${editedReading.date}T${editedReading.time}`;
      const timestamp = new Date(dateTimeString).toISOString();

      // Create updated reading with all required properties
      const updatedReading: Reading = {
        ...existingReading,
        value: Number(editedReading.value),
        timestamp,
        note: editedReading.note,
        mealTiming: editedReading.mealTiming,
      };

      await updateReadings(updatedReading);
      setEditId(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  return (
    <TableCell>
      <div className={clsx("flex flex-row gap-2 items-center justify-start")}>
        {!editId || editId !== reading.id ? (
          <>
            <Pencil
              size={20}
              onClick={() => {
                setEditId(reading?.id ?? null);
                setEditedReading({
                  ...editedReading,
                  value: reading.value.toString(),
                  date: format(new Date(reading.timestamp), "yyyy-MM-dd"),
                  time: format(new Date(reading.timestamp), "HH:mm"),
                  note: reading.note || "",
                  mealTiming:
                    typeof reading.mealTiming === "string"
                      ? reading.mealTiming
                      : { custom: reading.mealTiming.custom },
                });
              }}
              className={clsx(
                "cursor-pointer text-gray-500 transition-all duration-150",
                "hover:text-blue-600",
                "dark:text-gray-300 dark:hover:text-blue-500 "
              )}
            />
            <Trash2
              size={20}
              onClick={() => {
                setShowDeleteReading(true);
                setReadingToDelete(reading?.id ?? "");
              }}
              className={clsx(
                "cursor-pointer text-gray-500 transition-all duration-150",
                "hover:text-blue-600",
                "dark:text-gray-300 dark:hover:text-blue-500"
              )}
            />
          </>
        ) : (
          <>
            <X
              size={20}
              onClick={() => setEditId(null)}
              className={clsx(
                "cursor-pointer text-gray-500 transition-all duration-150",
                "hover:text-blue-600",
                "dark:text-gray-300 dark:hover:text-blue-500 "
              )}
            />
            <Check
              size={20}
              onClick={() => {
                if (editReadingLoading) return;
                handleUpdateReading(reading.id ?? "");
              }}
              className={clsx(
                "cursor-pointer text-gray-500 transition-all duration-150",
                "hover:text-blue-600",
                "dark:text-gray-300 dark:hover:text-blue-500 ",
                editReadingLoading &&
                  "dark:text-gray-500 text-gray-300 pointer-events-none"
              )}
            />
          </>
        )}
      </div>
    </TableCell>
  );
};
