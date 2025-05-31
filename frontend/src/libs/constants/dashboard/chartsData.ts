import { convertToMmol, getReadingStatus, getStatusColorClass } from "@/libs/utils/utils.js";
import { useReadingStore } from "@/store/useReadingStore.js";
import { Unit } from "@/types/dashboardTypes.js";
import {
    format,
    parseISO,
    isAfter,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    isWithinInterval,
} from "date-fns";

// Helper functions
const getStatusIndicator = (status: string) => {
    switch (status) {
        case "very low":
        case "very high":
            return "🔴";
        case "low":
            return "🟠";
        case "normal":
            return "🟢";
        case "high":
            return "🔴";
        default:
            return "⚪";
    }
};


const getStatusTooltipFooter = (value: number, unit: Unit, targetRange: { min: number; max: number } | undefined) => {
    const status = getReadingStatus(unit === "mmol/L" ? value * 18 : value, unit, targetRange);
    const indicator = getStatusIndicator(status.status);
    return `${indicator} ${status.status}`;
};

const processDataPoints = (values: number[], unit: Unit, targetRange: { min: number; max: number } | undefined) => {
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const convertedAvg = Math.round(Number(convertToMmol(avg, unit, false)));
    const status = getReadingStatus(Math.round(avg), unit, targetRange);



    return {
        value: convertedAvg,
        color: getStatusColorClass(status.status, true),
    };
};

const createLineChartData = (labels: string[], dataPoints: any[], unit: Unit, title: string) => ({
    labels,
    datasets: [
        {
            label: `${title} Glucose Levels (${unit})`,
            data: dataPoints.map((dp) => dp.value),
            fill: false,
            borderColor: "#3B82F6",
            backgroundColor: "#3B82F6",
            tension: 0.3,
            pointRadius: 6,
            pointHoverRadius: 12,
            pointBackgroundColor: dataPoints.map((dp) => dp.color),
            pointHoverBackgroundColor: dataPoints.map(dp => `${dp.color}80`),
            pointBorderColor: "transparent",
            pointHoverBorderColor: dataPoints.map((dp) => dp.color)
        },
    ],
});

const createBarChartData = (barLabels: string[], barDataPoints: any[], unit: Unit) => {
    const baseBlueVariants = ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"];

    return {
        labels: barLabels,
        datasets: [
            {
                label: `Monthly Meal Timing Averages (${unit})`,
                data: barDataPoints.map((dp) => dp.value),
                backgroundColor: barDataPoints.map((dp) => `${dp.color}80`),
                borderRadius: 20,
                borderColor: barDataPoints.map((dp) => dp.color),
                pointBorderColor: "transparent",
                pointHoverBorderColor: "transparent",
                hoverBackgroundColor: barDataPoints.map((dp) => `${dp.color}`),
                hoverBorderWidth: 0,
                borderWidth: 2
            },
        ],
    };
};

const createPieChartData = (statusCounts: any) => {
    const pieLabels = ["Very Low", "Low", "Normal", "High", "Very High"];

    return {
        labels: pieLabels,
        datasets: [
            {
                label: "Glucose Reading Distribution",
                data: [
                    statusCounts.veryLow,
                    statusCounts.low,
                    statusCounts.normal,
                    statusCounts.high,
                    statusCounts.veryHigh,
                ],
                backgroundColor: pieLabels.map(label => label === "Normal" ? "#22c55e80" : `${getStatusColorClass(label.toLowerCase(), true)}80`),
                borderColor: pieLabels.map(label => label === "Normal" ? "#22c55e" : `${getStatusColorClass(label.toLowerCase(), true)}`),
                hoverOffset: 15,
                borderWidth: 2,
                hoverBackgroundColor: pieLabels.map(label => label === "Normal" ? "#22c55e" : `${getStatusColorClass(label.toLowerCase(), true)}`),
                hoverBorderWidth: 0
            },
        ],
    };
};

export const ChartsData = (view: "month" | "week" = "month", unit: Unit, targetRange: { min: number; max: number } | undefined) => {
    const readings = useReadingStore((state) => state.readings);

    if (view === "week") {
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

        const filtered = readings.filter((r) => {
            const date = typeof r.timestamp === "string" ? parseISO(r.timestamp) : r.timestamp;
            return isWithinInterval(date, { start: weekStart, end: weekEnd });
        });

        const dayMap: { [key: string]: number[] } = {
            Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [],
        };

        filtered.forEach((r) => {
            const date = typeof r.timestamp === "string" ? parseISO(r.timestamp) : r.timestamp;
            const day = format(date, "eee");
            if (dayMap[day]) dayMap[day].push(r.value);
        });

        const labels = Object.keys(dayMap);
        const dataPoints = labels.map((day) => {
            const values = dayMap[day];
            return values.length === 0
                ? { value: null, color: 'transparent' }
                : processDataPoints(values, unit, targetRange);
        });


        return {
            lineChartData: createLineChartData(labels, dataPoints, unit, "Weekly"),
            getStatusTooltipFooter: (value: number) => getStatusTooltipFooter(value, unit, targetRange),
        };
    }

    // Month view
    const now = new Date();
    const monthStart = startOfMonth(now);

    const filteredMonth = readings.filter((r) => {
        const date = typeof r.timestamp === "string" ? parseISO(r.timestamp) : r.timestamp;
        return isAfter(date, monthStart);
    });

    // Daily averages for line chart
    const dailyMap: { [date: string]: number[] } = {};
    filteredMonth.forEach((r) => {
        const date = typeof r.timestamp === "string" ? parseISO(r.timestamp) : r.timestamp;
        const key = format(date, "yyyy-MM-dd");
        if (!dailyMap[key]) dailyMap[key] = [];
        dailyMap[key].push(r.value);
    });

    const sortedDates = Object.keys(dailyMap).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const labels = sortedDates.map(dateStr => format(new Date(dateStr), "MMM d"));
    const dataPoints = sortedDates.map((key) =>
        processDataPoints(dailyMap[key], unit, targetRange)
    );

    // Meal timing for bar chart
    const mealTimingMap: { [key: string]: number[] } = {};
    filteredMonth.forEach((r) => {
        let key = "";
        if (typeof r.mealTiming === "string") {
            key = r.mealTiming;
        } else if (typeof r.mealTiming === "object" && "custom" in r.mealTiming) {
            key = `Custom`;
        }
        if (!mealTimingMap[key]) mealTimingMap[key] = [];
        mealTimingMap[key].push(r.value);
    });

    const barLabels = Object.keys(mealTimingMap);
    const baseBlueVariants = ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"];
    const barDataPoints = barLabels.map((key, index) => {
        const values = mealTimingMap[key];
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        const convertedAvg = Math.round(Number(convertToMmol(avg, unit, false)));
        const status = getReadingStatus(Math.round(avg), unit, targetRange);

        const blueVariant = baseBlueVariants[index % baseBlueVariants.length];
        const color = status.status === "normal"
            ? blueVariant
            : getStatusColorClass(status.status, true);

        return {
            label: key.includes("Custom") ? "Custom" : key,
            value: convertedAvg,
            color,
        };
    });

    // Status counts for pie chart
    const statusCounts = {
        low: 0,
        normal: 0,
        high: 0,
        veryLow: 0,
        veryHigh: 0,
    };

    filteredMonth.forEach((reading) => {
        const { status } = getReadingStatus(reading.value, unit, targetRange);

        if (status === "low") statusCounts.low++;
        else if (status === "normal") statusCounts.normal++;
        else if (status === "high") statusCounts.high++;
        else if (status === "very low") statusCounts.veryLow++;
        else if (status === "very high") statusCounts.veryHigh++;
    });

    return {
        lineChartData: createLineChartData(labels, dataPoints, unit, "Monthly"),
        barChartData: createBarChartData(barLabels, barDataPoints, unit),
        pieChartData: createPieChartData(statusCounts),
        getStatusTooltipFooter: (value: number) => getStatusTooltipFooter(value, unit, targetRange),
    };
};