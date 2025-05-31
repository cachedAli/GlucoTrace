export function getResetStat(statName, date) {
    switch (statName) {
        case 'targetRange':
            return {
                value: "--",
                description: "No readings available.",
                lastUpdated: date.toISOString()
            };
        case 'highLow':
            return {
                value: "0",
                high: 0,
                low: 0,
                description: "no readings available.",
                lastUpdated: date.toISOString()
            };
        case 'morningEvening':
            return {
                value: "--",
                morning: null,
                evening: null,
                description: "no readings available.",
                lastUpdated: date.toISOString()
            };
        default:
            return {
                value: "--",
                description: "New month - tracking in progress",
                lastUpdated: date.toISOString()
            };
    }
}
