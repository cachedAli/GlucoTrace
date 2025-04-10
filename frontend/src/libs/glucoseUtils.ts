import { formatDistanceToNow } from "date-fns";
import { Reading } from "@/types/userTypes";

type Unit = "mg/dL" | "mmol/L";

type TargetRange = {
    min: number;
    max: number;
};

type Stats = {
    value: string;
    trend?: string;
    lastUpdated: string;
    description: string;
};

// Converts mg/dL to mmol/L or vice versa, rounded to 1 decimal, with optional unit string
export function convertToMmol(value: number, unit: Unit, addString: boolean = true) {
    if (unit === "mmol/L") return addString ? `${(value / 18).toFixed(1)} mmol/L` : (value / 18).toFixed(1);
    return addString ? `${value} mg/dL` : value;
}

// Returns glucose reading status and message based on the target range and unit
export const getReadingStatus = (value: number, unit: Unit, targetRange: TargetRange = { min: 70, max: 180 }) => {
    const reading = unit === "mmol/L" ? value * 18 : value;
    const min = targetRange?.min ?? 70;
    const max = targetRange?.max ?? 180;

    if (reading === undefined || reading === null) {
        return {
            status: "no reading",
            message: "No reading available yet. Please make sure to take a reading.",
        };
    } else if (reading < 54) {
        return {
            status: "very low",
            message: "Your glucose is critically low! Please take immediate action and consult your doctor.",
        };
    } else if (reading < min) {
        return {
            status: "low",
            message: "Your glucose is a bit low. Consider having a quick snack to bring it up.",
        };
    } else if (reading > max) {
        return {
            status: "high",
            message: "Your glucose level is high. You might want to review your meals or insulin dosage.",
        };
    } else if (reading > 250) {
        return {
            status: "very high",
            message: "Your glucose is very high! Please monitor closely and consider seeking medical advice.",
        };
    } else {
        return {
            status: "normal",
            message: "Your glucose is within a healthy range. Keep up the great work!",
        };
    }
}

// Calculates the meal impact based on before and after meal readings, and returns impact description
export const getMealImpact = (readings: Reading[], unit: Unit) => {
    const sorted = [...readings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    for (let i = sorted.length - 1; i >= 0; i--) {
        const before = sorted[i];
        if (before.mealTiming === "Before Meal") {
            const beforeTime = new Date(before.timestamp).getTime();

            for (let j = i + 1; j < sorted.length; j++) {
                const after = sorted[j];
                if (after.mealTiming === "After Meal") {
                    const afterTime = new Date(after.timestamp).getTime();
                    const difference = (afterTime - beforeTime) / (1000 * 60 * 60);

                    if (difference <= 3 && difference > 0) {
                        const convertedBefore = Number(convertToMmol(before.value, unit, false));
                        const convertedAfter = Number(convertToMmol(after.value, unit, false));
                        const impact = convertedAfter - convertedBefore;
                        const roundedImpact = Math.round(impact * 100) / 100;
                        const impactString = String(roundedImpact);

                        return {
                            mealImpactValue: `${roundedImpact > 0 ? "+" : ""}${roundedImpact} ${unit}`,
                            mealImpactTimeFrame: `Taken ${formatDistanceToNow(new Date(after.timestamp), { addSuffix: true })}`,
                            mealImpactDescription: getMealImpactDescription(impactString, unit),
                        };
                    }
                }
            }
        }
    }

    return {
        mealImpactValue: "--",
        mealImpactTimeFrame: "No recent meal data",
        mealImpactDescription: "You need both Before and After Meal readings to see impact.",
    };
};
// Provides a description of the meal impact based on the glucose impact value
const getMealImpactDescription = (impact: string, unit: Unit) => {
    if (impact === "--") {
        return "You need both Before and After Meal readings to see impact.";
    }

    const numeric = parseInt(impact)

    const value = Number(convertToMmol(numeric, unit, false));

    if (value > 40) {
        return "Your glucose rises significantly after meals. Consider adjusting meal portions!";
    } else if (value > 20) {
        return "There's a moderate rise after meals. Looks okay!";
    } else if (value > 0) {
        return "Minimal glucose rise after meals. Good job!";
    } else if (value <= 0) {
        return "Your glucose doesn't rise after meals. Watch out for lows!";
    }
};

// Calculates the percentage of readings within the target range
export const calculatePercentageInRange = (
    readings: Reading[],
    targetRange: TargetRange = { min: 70, max: 180 }
) => {
    const total = readings.length;
    const inRange = readings.filter(r => r.value >= targetRange.min && r.value <= targetRange.max).length;
    if (total === 0) return 0;
    return (inRange / total) * 100;
};

// Returns updated stats including percentage in range, trend, and description based on current readings and previous stats
export const getUpdatedInRangeStats = (
    readings: Reading[],
    previousStats: Stats | null,
    targetRange: TargetRange = { min: 70, max: 180 }
): Stats => {
    if (readings.length === 0) {
        return {
            value: "--",
            lastUpdated: "",
            description: "No readings available.",
        };
    }

    if (readings.length < 5) {
        return {
            value: "--",
            lastUpdated: "",
            description: "Need at least 5 readings to calculate reliable stats",
        };
    }

    const latestReading = readings[readings.length - 1];
    const currentPercentage = Math.round(calculatePercentageInRange(readings, targetRange));
    const currentISO = new Date(latestReading.timestamp).toISOString();


    // Set a description based on the percentage
    let description = "";
    if (currentPercentage >= 80) {
        description = "Excellent! You're staying in range.";
    } else if (currentPercentage >= 60) {
        description = "Doing okay, but there’s room to improve.";
    } else {
        description = "Many readings are outside your range. Try to review your routine.";
    }

    // If we don't have previous stats, return the current stats with description
    if (!previousStats) {
        return {
            value: `${currentPercentage}%`,
            lastUpdated: currentISO,
            description,
        };
    }

    // Otherwise, calculate the change in percentage and add a trend
    const previousDate = new Date(previousStats.lastUpdated);
    const currentDate = new Date(currentISO);
    const isNewDay = (
        currentDate.getDate() !== previousDate.getDate() ||
        currentDate.getMonth() !== previousDate.getMonth() ||
        currentDate.getFullYear() !== previousDate.getFullYear()
    );

    let trend = undefined;
    if (isNewDay) {
        const prevValue = parseInt(previousStats.value.replace('%', ''));
        const change = currentPercentage - prevValue;
        trend = change !== 0 ? `${change > 0 ? '+' : ''}${change}%` : undefined;
    }

    return {
        value: `${currentPercentage}%`,
        trend,
        lastUpdated: currentISO,
        description,
    };
};

