import { compareAsc, differenceInDays, differenceInMinutes, endOfDay, endOfMonth, endOfWeek, format, formatDistanceToNow, isThisMonth, isWithinInterval, parseISO, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";
import { Stats, TargetRange, Unit } from "@/types/dashboardTypes";
import { convertToMmol } from "@/libs/utils/utils";
import { Reading } from "@/types/userTypes";



// * Overview Page Functions

// Calculates the longest continuous period today where glucose was in the target range.
export const getStableGlucose = (
    readings: Reading[],
    unit: Unit,
    targetRange: TargetRange = { min: 70, max: 180 }
) => {
    const now = Date.now();
    const startDate = startOfDay(now);
    const endDate = endOfDay(now);
    const range = unit === "mmol/L"
        ? {
            min: Number((targetRange.min / 18.0182).toFixed(1)),
            max: Number((targetRange.max / 18.0182).toFixed(1)),
        }
        : targetRange;

    const todayReadings = readings.filter(reading =>
        isWithinInterval(reading.timestamp, { start: startDate, end: endDate })
    );
    const sortedReadings = todayReadings.sort((a, b) =>
        compareAsc(a.timestamp, b.timestamp)
    );

    let currentStable: Reading[] = [];
    let lastTimestamp = null;
    let longestStable: Reading[] = [];

    for (let i = 0; i < sortedReadings.length; i++) {
        const reading = sortedReadings[i];
        const unitValue = Number(convertToMmol(reading.value, unit, false))
        const inRange = unitValue >= range.min && unitValue <= range.max;


        if (!inRange) {
            if (currentStable.length > longestStable.length) {
                longestStable = [...currentStable];
            }
            currentStable = [];
            lastTimestamp = null;
            continue;
        }

        if (
            lastTimestamp &&
            differenceInMinutes(reading.timestamp, lastTimestamp) > 180
        ) {
            if (currentStable.length > longestStable.length) {
                longestStable = [...currentStable];
            }
            currentStable = [];
        }

        currentStable.push(reading);
        lastTimestamp = reading.timestamp;
    }

    if (currentStable.length > longestStable.length) {
        longestStable = [...currentStable];
    }

    if (longestStable.length === 0) {
        return {
            value: "0 hrs 0 mins",
            timeframe: "No stable periods today"
        };
    }

    const start = longestStable[0].timestamp;
    const end = longestStable[longestStable.length - 1].timestamp;
    const durationMinutes = differenceInMinutes(end, start);

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    const fromTime = new Date(start).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
    const toTime = new Date(end).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });

    return {
        value: `${hours} hrs ${minutes} mins`,
        timeframe: `From ${fromTime} to ${toTime}`,
    };
};

// Computes the 7-day average glucose and provides insights and trend compared to previous value.
export const get7DayAverage = (readings: Reading[], unit: Unit, previousStats: Stats | null): Stats => {
    const now = Date.now();
    const sevenDaysAgo = subDays(now, 7)

    const conversion = (value: number) => {
        return Number(convertToMmol(value, unit, false));
    }

    const last7DaysReadings = readings.filter((reading) => {
        return isWithinInterval(reading.timestamp, { start: sevenDaysAgo, end: now })
    })

    if (last7DaysReadings.length === 0) {
        return {
            value: "--",
            description: "No readings in the last 7 days",
            lastUpdated: new Date().toISOString(),
        }
    };

    let total = 0;
    for (let i = 0; i < last7DaysReadings.length; i++) {
        let unitBasedValue = Number(conversion(readings[i].value))
        total += unitBasedValue;
    }

    const avg = total / last7DaysReadings.length


    const lowerThreshold = conversion(70);
    const upperThreshold = conversion(180);

    let description = "";
    if (avg < lowerThreshold) {
        description = "Glucose is low. Check your levels.";
    } else if (avg >= lowerThreshold && avg <= upperThreshold) {
        description = "Good control! Keep it up.";
    } else {
        description = "High levels. Consult your doctor.";
    }

    // Trend calculation
    let trend: string | undefined;
    if (previousStats?.value && previousStats.value !== "--") {
        const prevValue = parseFloat(previousStats.value);
        if (!isNaN(prevValue) && prevValue !== 0) {
            const change = avg - prevValue;
            const percentageChange = (change / prevValue) * 100;

            if (Math.abs(percentageChange) >= 0.1) {
                const rounded = percentageChange.toFixed(1);
                trend = `${change >= 0 ? '+' : ''}${rounded}%`;
            }
        }
    }

    return {
        value: unit === "mg/dL"
            ? `${Math.round(avg)}`
            : `${Number(avg.toFixed(1))}`,
        description: description,
        lastUpdated: new Date().toISOString(),
        trend,
    }
}

// Returns how many days in the current week (Mon–Sun) had logged glucose readings
export const getWeeklyLoggingSummary = (readings: Reading[]) => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });     // Sunday

    // Filter readings within this week
    const currentWeekReadings = readings.filter((reading) =>
        isWithinInterval(reading.timestamp, { start: weekStart, end: weekEnd })
    );

    // Count unique days that had at least one reading
    const loggedDays = new Set<string>();
    for (const reading of currentWeekReadings) {
        const day = new Date(reading.timestamp).toDateString();
        loggedDays.add(day);
    }

    const daysLogged = loggedDays.size;

    // Friendly message
    let message = "";
    if (daysLogged === 7) {
        message = `You logged all 7 days. Amazing streak! 🎉`;
    } else if (daysLogged >= 5) {
        message = `You logged ${daysLogged} days. Great consistency!`;
    } else if (daysLogged >= 3) {
        message = `You logged ${daysLogged} days. You're getting there!`;
    } else if (daysLogged >= 1) {
        message = `You logged ${daysLogged} day${daysLogged > 1 ? "s" : ""}. Let’s try to log more!`;
    } else {
        message = `No readings this week yet. Start logging to stay on track!`;
    }

    return {
        value: `${daysLogged} of 7 days`,
        description: message,
    };
};

//* Add Reading Page Functions

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
const calculatePercentageInRange = (
    readings: Reading[],
    unit: Unit,
    targetRange: TargetRange = { min: 70, max: 180 }
) => {
    const total = readings.length;

    const inRange = readings.filter(r => Number(convertToMmol(r.value, unit, false)) >= targetRange.min && Number(convertToMmol(r.value, unit, false)) <= targetRange.max).length;
    if (total === 0) return 0;
    return (inRange / total) * 100;
};

// Returns updated stats including percentage in range, trend, and description based on current readings and previous stats
export const getUpdatedInRangeStats = (
    readings: Reading[],
    previousStats: Stats | null,
    unit: Unit,
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
    const currentPercentage = Math.round(calculatePercentageInRange(readings, unit, targetRange));
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
    if (previousStats) {
        const prevValueStr = previousStats.value.replace('%', '');
        const prevValue = parseInt(prevValueStr, 10);

        if (!isNaN(prevValue)) {
            const daysBetween = differenceInDays(
                new Date(currentISO),
                new Date(previousStats.lastUpdated)
            );

            if (daysBetween <= 7) {
                const change = currentPercentage - prevValue;
                trend = change !== 0 ? `${change > 0 ? '+' : ''}${change}%` : undefined;
            }
        }
    }

    return {
        value: `${currentPercentage}%`,
        trend,
        lastUpdated: currentISO,
        description,
    };
};

// Calculates weekly in-range glucose stats compared to previous stats
export const getWeeklyStats = (
    readings: Reading[],
    previousStats: Stats | null,
    unit: Unit,
    targetRange: TargetRange = { min: 70, max: 180 }
): Stats => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weeklyReadings = readings.filter(r =>
        isWithinInterval(new Date(r.timestamp), {
            start: weekStart,
            end: now
        })
    );
    return getUpdatedInRangeStats(weeklyReadings, previousStats, unit, targetRange);
};

export const getMonthlyStats = (
    readings: Reading[],
    previousStats: Stats | null,
    unit: Unit,
    targetRange: TargetRange = { min: 70, max: 180 }
): Stats => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthlyReadings = readings.filter((r) =>
        isWithinInterval(new Date(r.timestamp), {
            start: monthStart,
            end: now,
        })
    );
    return getUpdatedInRangeStats(monthlyReadings, previousStats, unit, targetRange);
};

//* Reading History Page Functions

// Returns all glucose readings from the current week
export const getThisWeekReadings = (readings: Reading[]) => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });

    return readings.filter((reading) => {
        const date = parseISO(reading.timestamp as string);
        return isWithinInterval(date, { start: weekStart, end: now });
    });
};

// Returns a short weekly summary message based on how many readings were logged.
export const getThisWeekReadingsDescription = (count: number) => {
    if (count === 0) return "No readings logged yet this week.";
    if (count < 5) return "Only a few entries this week. Try to log more regularly.";
    return "You're doing great — consistent tracking this week!";
}

// Counts the number of high and low readings based on unit thresholds
const getHighAndLowReadings = (readings: Reading[], unit: Unit) => {
    let high = 0;
    let low = 0;
    readings.forEach((reading) => {
        const value = Number(convertToMmol(reading.value, unit, false));
        const lowUnitValue = unit === "mg/dL" ? 70 : 3.9;
        const highUnitValue = unit === "mg/dL" ? 180 : 10;

        if (value < lowUnitValue) low++
        else if (value > highUnitValue) high++
    })
    return { high, low }
}

// Calculates updated high/low stats with trend and description based on previous data
export const getUpdatedHighLowStats = (
    readings: Reading[],
    previousStats: Stats | null,
    unit: Unit
): Stats => {

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    // Filter readings to current week only
    const currentWeekReadings = readings.filter(r =>
        isWithinInterval(new Date(r.timestamp), { start: weekStart, end: now })
    );
    const { high, low } = getHighAndLowReadings(currentWeekReadings, unit);
    const currentISO = now.toISOString();

    let description = "Track your readings to see patterns!";
    let trend: string | undefined;

    if (previousStats) {
        // DIRECTLY ACCESS STORED HIGH/LOW COUNTS
        const prevHigh = previousStats.high || 0;
        const prevLow = previousStats.low || 0;

        // Calculate trend
        const totalChange = (high + low) - (prevHigh + prevLow);
        trend = totalChange !== 0 ? `${totalChange > 0 ? '+' : ''}${totalChange}` : undefined;

        // Build description using ACTUAL COUNTS
        if (high > prevHigh && low > prevLow) {
            description = "You had more highs and lows this week — stay alert and keep tracking.";
            trend = undefined;
        } else if (high > prevHigh) {
            description = "More highs than last week — review your meals and activities.";
        } else if (low > prevLow) {
            description = "More lows this week — stay balanced and watch your snacks.";
        } else {
            description = "Great job! Fewer highs and lows this week.";
        }
    }

    return {
        value: `${high + low}`,
        high,
        low,
        lastUpdated: currentISO,
        description,
        trend
    };
};

// Identifies the weekday with the highest number of readings this week
export const getBestReadingDay = (readings: Reading[]): Stats => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });

    // Get readings for current week only
    const weeklyReadings = readings.filter(r =>
        isWithinInterval(new Date(r.timestamp), {
            start: weekStart,
            end: now
        })
    );

    // Count readings per day
    const dayCounts: Record<string, number> = {
        Monday: 0, Tuesday: 0, Wednesday: 0,
        Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
    };

    weeklyReadings.forEach(reading => {
        const day = format(new Date(reading.timestamp), 'EEEE');
        dayCounts[day]++;
    });

    // Find day with max readings
    const maxCount = Math.max(...Object.values(dayCounts));
    const [bestDay] = Object.entries(dayCounts).find(([_, count]) => count === maxCount) || ["--"];

    return {
        value: maxCount > 0 ? bestDay : "--",
        lastUpdated: weekStart.toISOString(),
        description: getBestDayDescription(maxCount),

    };
};

// Returns a description message based on number of readings that day
const getBestDayDescription = (count: number) => {
    if (count === 0) return "No readings this week yet. Start tracking!";
    if (count <= 2) return "You're starting to build a habit. Keep going!";
    return `This was your most consistent day with ${count} readings.`;
};


// * Trend Page Functions

// Calculates the percentage change in blood sugar readings for the current month compared to the previous month or the last available data.
export const getMonthChange = (
    readings: Reading[],
    previousStats: Stats | null,
    unit: Unit
): Stats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Parse ACTUAL previous average from description
    let previousAverage: number | null = null;
    if (previousStats?.description) {
        const matches = previousStats.description.match(/From ([\d.]+) to [\d.]+/);
        if (matches) previousAverage = parseFloat(matches[1]);
    }

    // 2. Get current month readings
    const currentReadings = readings
        .filter(r => {
            const date = new Date(r.timestamp);
            return date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear;
        })
        .map(r => unit === "mg/dL" ? convertToMmol(r.value, unit, false) as number : r.value);

    // 3. Calculate current average if enough data
    const currentAvg = currentReadings.length >= 5
        ? currentReadings.reduce((a, b) => a + b, 0) / currentReadings.length
        : null;

    // 4. Valid comparison possible
    if (previousAverage && currentAvg) {
        const percentageChangeNum = ((currentAvg - previousAverage) / previousAverage * 100);
        const arrow = percentageChangeNum >= 0 ? '↑' : '↓';
        const percentageChange = Math.abs(percentageChangeNum).toFixed(1);
        return {
            value: `${arrow} ${percentageChange}%`,
            description: `From ${previousAverage.toFixed(1)} to ${currentAvg.toFixed(1)} ${unit}`,
            lastUpdated: now.toISOString(),
            trend: percentageChange
        };
    }

    // 5. Fallback to direct month comparison
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthReadings = readings
        .filter(r => {
            const date = new Date(r.timestamp);
            return date.getMonth() === lastMonth &&
                date.getFullYear() === lastMonthYear;
        })
        .map(r => unit === "mg/dL" ? convertToMmol(r.value, unit, false) as number : r.value);


    // 6. Final calculation
    const baseStats: Stats = {
        value: "--",
        description: "Not enough data available for comparison",
        lastUpdated: now.toISOString()
    };

    if (currentReadings.length < 5 || lastMonthReadings.length < 5) return baseStats;
    if (now.getDate() < 7) return baseStats;

    const currentFallbackAvg = currentReadings.reduce((a, b) => a + b, 0) / currentReadings.length;
    const lastFallbackAvg = lastMonthReadings.reduce((a, b) => a + b, 0) / lastMonthReadings.length;
    const percentageNum = ((currentFallbackAvg - lastFallbackAvg) / lastFallbackAvg * 100);
    const arrow = percentageNum >= 0 ? '↑' : '↓';
    const percentage = Math.abs(percentageNum).toFixed(1);


    return {
        value: `${arrow} ${percentage}%`,
        description: `From ${Number(convertToMmol(lastFallbackAvg, unit, false)).toFixed(1)} ${unit} to ${Number(convertToMmol(currentFallbackAvg, unit, false)).toFixed(1)} ${unit}`,
        lastUpdated: now.toISOString(),
        trend: percentage
    };
};

// Counts morning and evening averages based on time of day
const getMorningEveningAverages = (readings: Reading[], unit: Unit) => {
    let morningTotal = 0, morningCount = 0;
    let eveningTotal = 0, eveningCount = 0;

    readings.forEach((reading) => {
        const date = new Date(reading.timestamp);
        const hours = date.getHours();
        const value = Number(convertToMmol(reading.value, unit, false));

        // Morning: 5AM - 11:59AM
        if (hours >= 5 && hours < 12) {
            morningTotal += value;
            morningCount++;
        }
        // Evening: 5PM - 10:59PM
        else if (hours >= 17 && hours < 23) {
            eveningTotal += value;
            eveningCount++;
        }
    });

    return {
        morning: morningCount > 0 ? Number((morningTotal / morningCount).toFixed(1)) : null,
        evening: eveningCount > 0 ? Number((eveningTotal / eveningCount).toFixed(1)) : null,
    };
};

// Calculates updated morning/evening stats with trend and description
export const getUpdatedMorningEveningStats = (
    readings: Reading[],
    previousStats: Stats | null,
    unit: Unit
): Stats => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const currentWeekReadings = readings.filter(r =>
        isWithinInterval(new Date(r.timestamp), { start: weekStart, end: now })
    );

    const { morning, evening } = getMorningEveningAverages(currentWeekReadings, unit);
    const currentISO = now.toISOString();

    // Unit-specific validation threshold (70 mg/dL = 3.9 mmol/L)
    const VALID_THRESHOLD = unit === 'mg/dL' ? 70 : 3.9;

    // Format values with units
    const formatValue = (val: number | null) =>
        val !== null ? `${val.toFixed(1)} ${unit}` : "--";

    const morningDisplay = formatValue(morning);
    const eveningDisplay = formatValue(evening);

    let description = "Track your morning/evening patterns!";
    let trend: string | undefined;

    if (previousStats) {
        const prevMorning = previousStats.morning ?? null;
        const prevEvening = previousStats.evening ?? null;

        // Calculate totals safely
        const currentTotal = (morning ?? 0) + (evening ?? 0);
        const previousTotal = (prevMorning ?? 0) + (prevEvening ?? 0);

        // Validation checks
        const isCurrentValid =
            (morning ?? 0) >= VALID_THRESHOLD &&
            (evening ?? 0) >= VALID_THRESHOLD;

        const isPreviousValid = previousTotal > 0;

        if (isCurrentValid && isPreviousValid) {
            const percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
            const rounded = Math.round(percentageChange);

            if (!isNaN(rounded) && rounded !== 0) {
                trend = `${rounded >= 0 ? '+' : ''}${rounded}%`;
                description = percentageChange > 0
                    ? "Your averages increased this week. Review daily habits."
                    : "Your averages improved this week. Keep it up!";
            }
        }
    }

    return {
        value: `${morningDisplay} | ${eveningDisplay}`,
        morning: morning,
        evening: evening,
        lastUpdated: currentISO,
        description,
        trend
    };
};

// Estimates HbA1c based on glucose readings from the current month.
export const estimateHba1c = (
    readings: Reading[],
    unit: Unit
): { value: string; description: string; timeFrame: string } => {
    const DEFAULT_VALUE = "--";
    const DEFAULT_DESCRIPTION = "Track consistently for HbA1c estimation";

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    // 1. Filter current month's readings (until today)
    const relevantReadings = readings.filter(reading => {
        const readingDate = new Date(reading.timestamp);
        return isThisMonth(readingDate) && readingDate <= now;
    });

    // No current month data case
    if (relevantReadings.length === 0) {
        return {
            value: DEFAULT_VALUE,
            description: "Start tracking to estimate HbA1c",
            timeFrame: currentMonthStart.toLocaleString('default', { month: 'long' })

        };
    }

    // 2. Check coverage within current month
    const sortedTimestamps = relevantReadings
        .map(r => new Date(r.timestamp).getTime())
        .sort((a, b) => a - b);

    const earliestDate = new Date(sortedTimestamps[0]);
    const daysTracked = differenceInDays(now, earliestDate) + 1; // +1 to include start day

    if (daysTracked < 7) {
        return {
            value: DEFAULT_VALUE,
            description: DEFAULT_DESCRIPTION,
            timeFrame: `${currentMonthStart.toLocaleString('default', { month: 'long' })} (${7 - daysTracked} ${daysTracked >= 1 ? "day" : "days"} needed)`
        };
    }

    // 3. Calculate HbA1c
    const averageMg = relevantReadings.reduce((sum, r) => {
        return sum + (unit === "mg/dL" ? Number(convertToMmol(r.value, unit, false)) : r.value);
    }, 0) / relevantReadings.length;


    const hba1c = (averageMg + 46.7) / 28.7;


    return {
        value: `${hba1c.toFixed(1)}%`,
        description: `Based on ${relevantReadings.length} readings (${daysTracked}/${new Date().getDate()} days)`,
        timeFrame: currentMonthStart.toLocaleString('default', { month: 'long' })

    };
};
