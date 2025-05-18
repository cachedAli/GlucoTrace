import { useEffect } from "react";

import { differenceInDays, formatDistanceToNow, startOfWeek } from "date-fns";
import { PiForkKnifeFill, PiSunHorizonFill } from "react-icons/pi";
import { IoCalendarOutline, IoBarChart } from "react-icons/io5";
import { LuNotepadText, LuRefreshCw } from "react-icons/lu";
import { BsHourglassSplit, BsStars } from "react-icons/bs";
import { GiCorkedTube, GiTrophy } from "react-icons/gi";
import { FaDroplet, FaClock } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";

import { estimateHba1c, get7DayAverage, getBestReadingDay, getMealImpact, getMonthChange, getPreviousStat, getStableGlucose, getThisWeekReadings, getThisWeekReadingsDescription, getUpdatedHighLowStats, getUpdatedMorningEveningStats, getWeeklyLoggingSummary, getWeeklyStats, saveStat } from "@/libs/utils/statFieldUtils";
import { convertToMmol, getReadingStatus } from "@/libs/utils/utils";
import { useReadingStore } from "@/store/useReadingStore";
import { useUserStore } from "@/store/useUserStore";
import { StoredStat } from "@/types/dashboardTypes";


const StatFields = () => {

    const user = useUserStore((state) => state.user);
    const unit = user?.medicalProfile?.bloodSugarUnit ?? "mg/dL";
    const targetRange = user?.medicalProfile?.targetBloodSugarRange;
    const readings = useReadingStore((state) => state.readings);

    // * Previous Stats
    const previous7DayStats = getPreviousStat('sevenDayAverage');
    const previousTargetRangeStats = getPreviousStat('targetRange');
    const previousHighLowStats = getPreviousStat('highLow');
    const previousMonthlyChange = getPreviousStat('monthlyChange');
    const previousMorningEveningStats = getPreviousStat('morningEvening');

    // * Overview Stats
    const stableGlucoseStats = getStableGlucose(readings, unit, targetRange)
    const sevenDaysAverageStats = get7DayAverage(readings, unit, previous7DayStats);
    const WeeklyLoggingSummaryStats = getWeeklyLoggingSummary(readings)

    // * Add Reading Stats
    const lastReading = readings[0];
    const { mealImpactValue, mealImpactTimeFrame, mealImpactDescription } = getMealImpact(readings, unit);
    const targetRangeStats = getWeeklyStats(readings, previousTargetRangeStats, unit,targetRange);
    const lastReadingTimeStamp = lastReading?.timestamp;
    const relativeTime = lastReadingTimeStamp && formatDistanceToNow(new Date(lastReadingTimeStamp), { addSuffix: true });
    const reading = lastReading?.value;
    const { message } = getReadingStatus(reading, unit, targetRange);

    // * Reading History Stats
    const thisWeekReadings = getThisWeekReadings(readings);
    const highLowStats = getUpdatedHighLowStats(readings, previousHighLowStats, unit);
    const bestDayStats = getBestReadingDay(readings)

    // * Trend Stats
    const monthlyChangeStats = getMonthChange(readings, previousMonthlyChange, unit);
    const morningEveningStats = getUpdatedMorningEveningStats(readings, previousMorningEveningStats, unit)
    const hba1cStats = estimateHba1c(readings, unit)

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
                else if (statName === 'morningEvening') {
                    const lastWeekStart = startOfWeek(lastDate, { weekStartsOn: 1 });
                    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });

                    if (lastWeekStart < currentWeekStart) {
                        allStats[statName] = {
                            previous: statData.current,
                            current: {
                                value: "--",
                                morning: null,
                                evening: null,
                                description: "no readings available.",
                                lastUpdated: currentWeekStart.toISOString()
                            }
                        };
                    }
                }
                else if (statName === 'sevenDayAverage') {
                    const lastDate = new Date(statData.current.lastUpdated);
                    const daysSinceUpdate = differenceInDays(now, lastDate);

                    if (daysSinceUpdate >= 7) {
                        allStats[statName] = {
                            previous: statData.current,
                            current: {
                                value: "--",
                                description: "no readings available.",
                                lastUpdated: now.toISOString()
                            }
                        };
                    }
                }
                else if (statName === 'monthlyChange') {
                    const lastDate = new Date(statData.current?.lastUpdated || 0);
                    const lastMonth = lastDate.getMonth();
                    const currentMonth = now.getMonth();

                    if (lastMonth !== currentMonth) {
                        allStats[statName] = {
                            previous: statData.current,
                            current: {
                                value: "--",
                                description: "New month - tracking in progress",
                                lastUpdated: now.toISOString()
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

    useEffect(() => {
        if (targetRangeStats.value !== "--") {
            saveStat('targetRange', targetRangeStats);
        }
    }, [targetRangeStats]);

    useEffect(() => {
        if (highLowStats.value !== "--") {
            saveStat('highLow', highLowStats);
        }
    }, [highLowStats]);

    useEffect(() => {
        if (morningEveningStats.value !== "--") {
            saveStat('morningEvening', morningEveningStats);
        }
    }, [morningEveningStats]);

    useEffect(() => {
        if (monthlyChangeStats.value !== "--") {
            saveStat('monthlyChange', monthlyChangeStats);
        }
    }, [monthlyChangeStats]);

    useEffect(() => {
        if (sevenDaysAverageStats.value !== "--") {
            saveStat('sevenDayAverage', sevenDaysAverageStats);
        }
    }, [sevenDaysAverageStats]);

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
            value: `${sevenDaysAverageStats.value} ${unit}`,
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
            title: "Monthly Avg. Glucose Change",
            value: monthlyChangeStats.value,
            icon: LuRefreshCw,
            timeFrame: monthlyChangeStats.value !== "--"
                ? "Compared to last month" : "No time data",
            description: monthlyChangeStats.description,
            isOverview: false,
        },
        {
            title: " Morning vs. Evening Averages",
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