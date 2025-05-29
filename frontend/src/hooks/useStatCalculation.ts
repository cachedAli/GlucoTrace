import { useEffect, useMemo } from "react";
import { useStats } from "@/providers/StatsProvider";
import { useReadingStore } from "@/store/useReadingStore";
import { useUserStore } from "@/store/useUserStore";
import {
    get7DayAverage,
    getWeeklyStats,
    getUpdatedHighLowStats,
    getMonthChange,
    getUpdatedMorningEveningStats
} from "../libs/utils/statFieldUtils";
import { StatName } from "@/types/dashboardTypes";

export const useStatCalculation = () => {
    const { stats, isStatsInitialized, updateStat } = useStats();
    const readings = useReadingStore(state => state.readings);
    const user = useUserStore(state => state.user);

    const unit = user?.medicalProfile?.bloodSugarUnit ?? "mg/dL";
    const targetRange = user?.medicalProfile?.targetBloodSugarRange;

    // Calculate all stats in a single memo
    const calculatedStats = useMemo(() => {
        return {
            sevenDaysAverageStats: get7DayAverage(readings, unit, stats.sevenDayAverage),
            targetRangeStats: getWeeklyStats(readings, stats.targetRange, unit, targetRange),
            highLowStats: getUpdatedHighLowStats(readings, stats.highLow, unit),
            monthlyChangeStats: getMonthChange(readings, stats.monthlyChange, unit),
            morningEveningStats: getUpdatedMorningEveningStats(readings, stats.morningEvening, unit),
        };
    }, [readings, unit, targetRange, stats]);

    // Single effect for all stat updates
    useEffect(() => {
        if (!isStatsInitialized) return;
        
        const updates = [];
        
        if (calculatedStats.targetRangeStats.value !== "--") {
            updates.push({ statName: "targetRange", stat: calculatedStats.targetRangeStats });
        }
        if (calculatedStats.highLowStats.value !== "--") {
            updates.push({ statName: "highLow", stat: calculatedStats.highLowStats });
        }
        if (calculatedStats.morningEveningStats.value !== "--") {
            updates.push({ statName: "morningEvening", stat: calculatedStats.morningEveningStats });
        }
        if (calculatedStats.monthlyChangeStats.value !== "--") {
            updates.push({ statName: "monthlyChange", stat: calculatedStats.monthlyChangeStats });
        }
        if (calculatedStats.sevenDaysAverageStats.value !== "--") {
            updates.push({ statName: "sevenDayAverage", stat: calculatedStats.sevenDaysAverageStats });
        }

        // Batch updates
        updates.forEach(({ statName, stat }) => {
            updateStat(statName as StatName, stat);
        });
    }, [isStatsInitialized, calculatedStats]);

    return calculatedStats;
};