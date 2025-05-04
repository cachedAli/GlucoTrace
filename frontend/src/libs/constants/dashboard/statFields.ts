import { useEffect } from "react";

import { LuRuler, LuNotepadText, LuRefreshCw } from "react-icons/lu";
import { PiForkKnifeFill, PiSunHorizonFill } from "react-icons/pi";
import { IoCalendarOutline, IoBarChart } from "react-icons/io5";
import { FaDroplet, FaClock } from "react-icons/fa6";
import { BsHourglassSplit } from "react-icons/bs";
import { formatDistanceToNow, startOfWeek } from "date-fns";
import { GiCorkedTube } from "react-icons/gi";
import { FaShieldAlt } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import { FiTarget } from "react-icons/fi";

import { getBestReadingDay, getMealImpact, getPreviousStat, getReadingStatus, getThisWeekReadings, getThisWeekReadingsDescription, getUpdatedHighLowStats, getWeeklyStats, saveStat } from "@/libs/utils/statFieldUtils";
import { useReadingStore } from "@/store/useReadingStore";
import { useUserStore } from "@/store/useUserStore";
import { StoredStat } from "@/types/dashboardTypes";
import { convertToMmol } from "@/libs/utils/utils";


const StatFields = () => {

    const user = useUserStore((state) => state.user);
    const readings = useReadingStore((state) => state.readings);
    const targetRange = user?.medicalProfile?.targetBloodSugarRange;

    const previousTargetRangeStats = getPreviousStat('targetRange');
    const targetRangeStats = getWeeklyStats(readings, previousTargetRangeStats, targetRange);
    const thisWeekReadings = getThisWeekReadings(readings);

    useEffect(() => {
        const checkAndArchiveStats = () => {
            const allStats: Record<string, StoredStat> = JSON.parse(localStorage.getItem("healthStats") || "{}");
            const now = new Date();

            Object.entries(allStats).forEach(([statName, statData]) => {
                if (!statData.current?.lastUpdated) return;
                const lastDate = new Date(statData.current.lastUpdated);

                // 1. Handle daily stats (targetRange)
                if (statName === 'targetRange') {
                    const lastWeekStart = startOfWeek(lastDate, { weekStartsOn: 1 });
                    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });

                    if (lastWeekStart < currentWeekStart) {
                        if (statData.current.value !== "--") {
                            allStats[statName] = {
                                previous: statData.current,
                                current: {
                                    value: "--",
                                    description: "No readings available.",
                                    lastUpdated: now.toISOString()
                                }
                            };
                        }
                    }
                }

                // 2. Handle weekly stats (highLow)
                else if (statName === 'highLow') {
                    const lastWeekStart = startOfWeek(lastDate, { weekStartsOn: 1 });
                    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });

                    if (lastWeekStart < currentWeekStart) {
                        allStats[statName] = {
                            previous: statData.current,
                            current: {
                                value: "0",
                                high: 0,
                                low: 0,
                                description: "no readings available.",
                                lastUpdated: currentWeekStart.toISOString()
                            }
                        };
                    }
                }
            });

            localStorage.setItem("healthStats", JSON.stringify(allStats));
        };



        // Initial check
        checkAndArchiveStats();

        // Set up midnight check
        const now = new Date();
        let nextMonday = startOfWeek(now, { weekStartsOn: 1 });

        // If current time is after the start of this week, schedule for next Monday
        if (now > nextMonday) {
            nextMonday = new Date(nextMonday.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        const timeUntilMonday = nextMonday.getTime() - now.getTime();

        let intervalId: NodeJS.Timeout;
        const timerId = setTimeout(() => {
            checkAndArchiveStats();
            // Set weekly interval after initial timeout
            intervalId = setInterval(checkAndArchiveStats, 604800000); // 7 days
        }, timeUntilMonday);

        // Cleanup function to clear both timeout and interval
        return () => {
            clearTimeout(timerId);
            clearInterval(intervalId);
        };
    }, []);



    // Add this useEffect



    useEffect(() => {
        if (targetRangeStats.value !== "--") {
            saveStat('targetRange', targetRangeStats);
        }
    }, [targetRangeStats]);



    const lastReading = readings[readings.length - 1];
    const lastReadingTimeStamp = lastReading?.timestamp;
    const relativeTime = lastReadingTimeStamp && formatDistanceToNow(new Date(lastReadingTimeStamp), { addSuffix: true });
    const reading = lastReading?.value;
    const unit = user?.medicalProfile?.bloodSugarUnit ?? "mg/dL";
    const { mealImpactValue, mealImpactTimeFrame, mealImpactDescription } = getMealImpact(readings, unit);
    const { message } = getReadingStatus(reading, unit, targetRange);
    const previousHighLowStats = getPreviousStat('highLow');
    const highLowStats = getUpdatedHighLowStats(readings, previousHighLowStats, unit);
    const bestDayStats = getBestReadingDay(readings)

    useEffect(() => {
        if (highLowStats.value !== "--") {
            saveStat('highLow', highLowStats);
        }
    }, [highLowStats]);

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
            value: `${thisWeekReadings.length} entries`,
            icon: IoCalendarOutline,
            isOverview: false,
            description: getThisWeekReadingsDescription(thisWeekReadings.length),

        },
        {
            title: " High/Low Episodes",
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