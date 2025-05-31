import { useEffect, useMemo } from "react";

import { formatDistanceToNow } from "date-fns";
import { PiForkKnifeFill, PiSunHorizonFill } from "react-icons/pi";
import { IoCalendarOutline, IoBarChart } from "react-icons/io5";
import { LuNotepadText, LuRefreshCw } from "react-icons/lu";
import { BsHourglassSplit, BsStars } from "react-icons/bs";
import { GiCorkedTube, GiTrophy } from "react-icons/gi";
import { FaDroplet, FaClock } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";

import { estimateHba1c, getBestReadingDay, getMealImpact, getStableGlucose, getThisWeekReadings, getThisWeekReadingsDescription, getWeeklyLoggingSummary } from "@/libs/utils/statFieldUtils.js";
import { convertToMmol, getReadingStatus } from "@/libs/utils/utils.js";
import { useStatCalculation } from "@/hooks/useStatCalculation.js";
import { useReadingStore } from "@/store/useReadingStore.js";
import { useUserStore } from "@/store/useUserStore.js";


const StatFields = () => {

    const { highLowStats, monthlyChangeStats, morningEveningStats, sevenDaysAverageStats, targetRangeStats } = useStatCalculation()

    const user = useUserStore((state) => state.user);
    const unit = user?.medicalProfile?.bloodSugarUnit ?? "mg/dL";
    const targetRange = user?.medicalProfile?.targetBloodSugarRange;
    const readings = useReadingStore((state) => state.readings);



    // * Overview Stats
    const stableGlucoseStats = useMemo(() =>
        getStableGlucose(readings, unit, targetRange),
        [readings, unit, targetRange]
    );

    const WeeklyLoggingSummaryStats = useMemo(() =>
        getWeeklyLoggingSummary(readings),
        [readings]
    );

    // * Add Reading Stats
    const lastReading = useMemo(() => readings[0], [readings]);

    const {
        mealImpactValue,
        mealImpactTimeFrame,
        mealImpactDescription
    } = useMemo(() =>
        getMealImpact(readings, unit),
        [readings, unit]
    );

    const lastReadingTimeStamp = useMemo(() =>
        lastReading?.timestamp,
        [lastReading]
    );

    const relativeTime = useMemo(() =>
        lastReadingTimeStamp
            ? formatDistanceToNow(new Date(lastReadingTimeStamp), { addSuffix: true })
            : undefined,
        [lastReadingTimeStamp]
    );

    const reading = useMemo(() =>
        lastReading?.value,
        [lastReading]
    );

    const { message } = useMemo(() =>
        getReadingStatus(reading, unit, targetRange),
        [reading, unit, targetRange]
    );

    // * Reading History Stats
    const thisWeekReadings = useMemo(() =>
        getThisWeekReadings(readings),
        [readings]
    );

    const bestDayStats = useMemo(() =>
        getBestReadingDay(readings),
        [readings]
    );

    // * Trend Stats
    const hba1cStats = useMemo(() =>
        estimateHba1c(readings, unit),
        [readings, unit]
    );


    const overviewStats = [
        {
            title: "Weekly Check-ins",
            value: WeeklyLoggingSummaryStats.value,
            icon: BsStars,
            bgIcon: GiTrophy,
            timeFrame: WeeklyLoggingSummaryStats.description,
            isOverview: true,
        },
        {
            title: "Stable Glucose Time",
            value: stableGlucoseStats.value,
            icon: FaDroplet,
            bgIcon: BsHourglassSplit,
            timeFrame: stableGlucoseStats.timeframe,
            isOverview: true,
        },
        {
            title: "7-Day Average",
            value: `${sevenDaysAverageStats.value} ${sevenDaysAverageStats.value === "--" ? "" : unit}`,
            icon: IoBarChart,
            bgIcon: IoCalendarOutline,
            trend: sevenDaysAverageStats.trend,
            timeFrame: sevenDaysAverageStats.description,
            isOverview: true,
        },
    ]

    const addReadingStats = [
        {
            title: "Last Reading",
            value: reading ? convertToMmol(reading, unit) : "--",
            icon: LuNotepadText,
            timeFrame: lastReadingTimeStamp ? `Taken ${relativeTime}` : "No recent reading",
            description: `${message}`,
            isOverview: false,
        },
        {
            title: "Impact of Meals on Glucose",
            value: mealImpactValue,
            icon: PiForkKnifeFill,
            timeFrame: mealImpactTimeFrame,
            description: mealImpactDescription,
            isOverview: false,
        },
        {
            title: "Your Target Range",
            value: targetRangeStats.value,
            icon: FaShieldAlt,
            trend: targetRangeStats.trend,
            timeFrame: targetRangeStats.lastUpdated
                ? formatDistanceToNow(new Date(targetRangeStats.lastUpdated), { addSuffix: true })
                : "No time data",
            description: targetRangeStats.description,
            isOverview: false,
        },
    ]

    const readingsHistoryStats = [
        {
            title: "Readings This Week",
            value: `${thisWeekReadings.length} entries`,
            icon: IoCalendarOutline,
            isOverview: false,
            description: getThisWeekReadingsDescription(thisWeekReadings.length),

        },
        {
            title: "High/Low Episodes",
            value: highLowStats.high ?? 0,
            icon: TiWarning,
            timeFrame: highLowStats.value === "0" ? "No time data" : "This week",
            description: highLowStats.description,
            trend: highLowStats.trend,
            isOverview: false,
            isSplitStat: true,
            splitStat1: "Highs",
            splitStat2: "Lows",
            secondValue: highLowStats.low ?? 0
        },
        {
            title: "Best Day for Readings",
            value: bestDayStats.value,
            icon: FaClock,
            timeFrame: bestDayStats.value === "--" ? "No time data" : "This week",
            description: bestDayStats.description,
            isOverview: false,
        },
    ]

    const trendStats = [
        {
            title: "Monthly Avg. Glucose Change",
            value: monthlyChangeStats.value,
            icon: LuRefreshCw,
            timeFrame: monthlyChangeStats.value !== "--"
                ? "Compared to last month" : "No time data",
            description: monthlyChangeStats.description,
            isOverview: false,
        },
        {
            title: "Morning vs. Evening Averages",
            value: morningEveningStats.morning ?? 0,
            icon: PiSunHorizonFill,
            timeFrame: morningEveningStats.value === "0" ? "No time data" : "This week",
            description: morningEveningStats.description,
            trend: morningEveningStats.trend,
            isOverview: false,
            isSplitStat: true,
            splitStat1: "M",
            splitStat2: "E",
            secondValue: morningEveningStats.evening ?? 0
        },
        {
            title: "Estimated HbA1c",
            value: hba1cStats.value,
            icon: GiCorkedTube,
            timeFrame: hba1cStats.timeFrame,
            description: hba1cStats.description,
            isOverview: false,
        },
    ]

    return { overviewStats, addReadingStats, trendStats, readingsHistoryStats };
}

export default StatFields