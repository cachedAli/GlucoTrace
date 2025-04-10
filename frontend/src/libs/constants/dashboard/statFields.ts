import { useEffect } from "react";

import { LuRuler, LuNotepadText, LuRefreshCw } from "react-icons/lu";
import { PiForkKnifeFill, PiSunHorizonFill } from "react-icons/pi";
import { IoCalendarOutline, IoBarChart } from "react-icons/io5";
import { FaDroplet, FaClock } from "react-icons/fa6";
import { BsHourglassSplit } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { GiCorkedTube } from "react-icons/gi";
import { FaShieldAlt } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import { FiTarget } from "react-icons/fi";

import { convertToMmol, getMealImpact, getReadingStatus, getUpdatedInRangeStats } from "@/libs/glucoseUtils";
import { useReadingStore } from "@/store/useReadingStore";
import { useUserStore } from "@/store/useUserStore";


const StatFields = () => {

    const user = useUserStore((state) => state.user);
    const readings = useReadingStore((state) => state.readings);
    const targetRange = user?.medicalProfile?.targetBloodSugarRange;
    const previousStats = JSON.parse(localStorage.getItem("previousStats") || "null");
    const targetRangeStats = getUpdatedInRangeStats(readings, previousStats, targetRange);

    useEffect(() => {
        if (targetRangeStats) localStorage.setItem("previousStats", JSON.stringify(targetRangeStats));
    }, [targetRangeStats]);

    const lastReading = readings[readings.length - 1];
    const lastReadingTimeStamp = lastReading?.timestamp;
    const relativeTime = lastReadingTimeStamp && formatDistanceToNow(new Date(lastReadingTimeStamp), { addSuffix: true });
    const reading = lastReading?.value;
    const unit = user?.medicalProfile?.bloodSugarUnit ?? "mg/dL";
    const { mealImpactValue, mealImpactTimeFrame, mealImpactDescription } = getMealImpact(readings, unit);
    const { message } = getReadingStatus(reading, unit, targetRange);


    const overviewStats = [
        {
            title: "Current value",
            value: "120mg/dl",
            icon: FaDroplet,
            bgIcon: BsHourglassSplit,
            trend: "+12%",
            timeFrame: "Last 30 days",
            isOverview: true,
        },
        {
            title: "7-Day Average",
            value: "120mg/dl",
            icon: IoBarChart,
            bgIcon: IoCalendarOutline,
            trend: "+12%",
            timeFrame: "Your average blood sugar this week",
            isOverview: true,
        },
        {
            title: "Time in Range",
            value: "85%",
            icon: LuRuler,
            bgIcon: FiTarget,
            trend: "+1%",
            timeFrame: "3% from yesterday",
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
            value: "28 entries",
            icon: IoCalendarOutline,
            timeFrame: "since last week",
            isOverview: false,
        },
        {
            title: " High/Low Episodes",
            value: "5 highs",
            icon: TiWarning,
            timeFrame: "Today",
            description: "Highs are higher than last week. Check your meals!",
            trend: "20%",
            isOverview: false,
        },
        {
            title: "Best Day for Readings",
            value: "Monday",
            icon: FaClock,
            timeFrame: "since last week",
            description: "Try tracking every day for a full picture!",
            isOverview: false,
        },
    ]

    const trendStats = [
        {
            title: "1-Month Change",
            value: "3% decrease",
            icon: LuRefreshCw,
            timeFrame: "since last month",
            isOverview: false,
        },
        {
            title: " Morning vs. Evening Averages",
            value: "112 mg/dl",
            icon: PiSunHorizonFill,
            timeFrame: "Today",
            description: "Highs are higher than last week. Check your meals!",
            trend: "20%",
            isOverview: false,
        },
        {
            title: "Estimated HbA1c",
            value: "11.2",
            icon: GiCorkedTube,
            timeFrame: "since last month",
            description: "Try tracking every day for a full picture!",
            isOverview: false,
        },
    ]

    return { overviewStats, addReadingStats, trendStats, readingsHistoryStats };
}

export default StatFields