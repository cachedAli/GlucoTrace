// utils/reportUtils.ts
import { TargetRange, Unit } from "@/types/dashboardTypes";
import { Reading } from "@/types/userTypes";
import {
    subDays,
    startOfMonth,
    endOfMonth,
    format,
    isWithinInterval,
    parseISO,
} from "date-fns";
import { estimateHba1c, get7DayAverage, getUpdatedInRangeStats } from "./statFieldUtils";
import { convertToMmol } from "./utils";
import dayjs from "dayjs";

// Type for time range selection
export type TimeRangeValue = "last7Days" | "thisMonth" | "custom";

// Function to get date range based on selection
export const getDateRange = (
    range: TimeRangeValue,
    customStart?: Date | string,
    customEnd?: Date | string
): { start: Date; end: Date; label: string } => {
    const now = new Date();

    switch (range) {
        case "last7Days":
            return {
                start: subDays(now, 6),
                end: now,
                label: `Last 7 Days (${format(subDays(now, 6), "MMM d")} - ${format(now, "MMM d, yyyy")})`
            };

        case "thisMonth":
            return {
                start: startOfMonth(now),
                end: now,
                label: `${format(now, "MMM yyyy")}`
            };



        case "custom":
            const isValidDate = (date: any) => dayjs(date).isValid();

            const start = isValidDate(customStart) ? dayjs(customStart).toDate() : now;
            const end = isValidDate(customEnd) ? dayjs(customEnd).toDate() : now;

            return {
                start,
                end,
                label: `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`
            };


    }
};

// Filter readings based on date range
export const filterReadingsByDate = (
    readings: Reading[],
    startDate: Date,
    endDate: Date
): Reading[] => {
    return readings.filter(reading => {
        const timestampDate = reading.timestamp instanceof Date
            ? reading.timestamp
            : parseISO(reading.timestamp);

        return isWithinInterval(timestampDate, {
            start: startDate,
            end: endDate

        })
    });
};

const getAverageInRange = (
    filteredReadings: Reading[],
    unit: Unit,

) => {


    const total = filteredReadings.reduce((sum, reading) => {
        const convertedValue = Number(convertToMmol(reading.value, unit, false));
        return sum + convertedValue;
    }, 0);

    const avg = total / filteredReadings.length;

    return {
        value: unit === "mg/dL" ? Math.round(avg) : Number(avg.toFixed(1)),
        lastUpdated: new Date().toISOString(),
    };
};


// Generate report data based on filtered readings
export const generateReportData = (
    filteredReadings: Reading[],
    dateRangeLabel: string,
    unit: Unit,
    targetRange: TargetRange = { min: 70, max: 180 },
    name: string,
    diabetesType: "Type 1" | "Type 2" | "Pre-diabetes",
    gender: "Male" | "Female" | "Other",
    age: string
) => {
    const avgGlucose = getAverageInRange(filteredReadings, unit);
    const timeInRange = getUpdatedInRangeStats(filteredReadings, null, unit, targetRange);

    const minMmol = Number(convertToMmol(targetRange.min, unit, false));
    const maxMmol = Number(convertToMmol(targetRange.max, unit, false));


    const mealTimingStats = filteredReadings.reduce(
        (acc, reading) => {
            const value = Number(convertToMmol(reading.value, unit, false));
            const isHigh = value > maxMmol;
            const isLow = value < minMmol;

            type Category = "Before Meal" | "After Meal" | "Fasting";
            const category = reading.mealTiming as Category;
            if (category && acc[category]) {
                acc[category].total += value;
                acc[category].count++;

                if (isHigh) acc[category].highs++;
                if (isLow) acc[category].lows++;
            }

            return acc;
        },
        {
            "Before Meal": { total: 0, count: 0, highs: 0, lows: 0 },
            "After Meal": { total: 0, count: 0, highs: 0, lows: 0 },
            Fasting: { total: 0, count: 0, highs: 0, lows: 0 },
        }
    );

    // Function to format number based on unit
    const formatValue = (val: number) =>
        unit === "mmol/L" ? Number(val.toFixed(1)) : Math.round(val);

    const mostHighMealTime = Object.entries(mealTimingStats).reduce(
        (max, [key, val]) => (val.highs > max.count ? { meal: key, count: val.highs } : max),
        { meal: "", count: -1 }
    ).meal;

    const mostLowMealTime = Object.entries(mealTimingStats).reduce(
        (max, [key, val]) => (val.lows > max.count ? { meal: key, count: val.lows } : max),
        { meal: "", count: -1 }
    ).meal;

    const totalHighs = Object.values(mealTimingStats).reduce((sum, val) => sum + val.highs, 0);
    const totalLows = Object.values(mealTimingStats).reduce((sum, val) => sum + val.lows, 0);


    return {
        range: dateRangeLabel,
        avgGlucose: formatValue(avgGlucose.value),
        timeInRange: timeInRange.value,
        readings: filteredReadings.length,
        a1c: estimateHba1c(filteredReadings, unit).value,
        beforeMeals:
            mealTimingStats["Before Meal"].count > 0
                ? formatValue(mealTimingStats["Before Meal"].total / mealTimingStats["Before Meal"].count)
                : 0,
        afterMeals:
            mealTimingStats["After Meal"].count > 0
                ? formatValue(mealTimingStats["After Meal"].total / mealTimingStats["After Meal"].count)
                : 0,
        fasting:
            mealTimingStats["Fasting"].count > 0
                ? formatValue(mealTimingStats["Fasting"].total / mealTimingStats["Fasting"].count)
                : 0,
        mostHighMealTime: mostHighMealTime || "N/A",
        mostLowMealTime: mostLowMealTime || "N/A",
        totalHighs,
        totalLows,
        unit,
        generatedDate: Date.now(),
        patientName: name,
        diabetesType: diabetesType,
        gender: gender,
        age: age
    };
};
