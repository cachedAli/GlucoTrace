import { twMerge } from "tailwind-merge"
import clsx, { ClassValue } from "clsx"

import { TargetRange, Unit } from "@/types/dashboardTypes";


// Combines class names using clsx and merges Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Capitalizes the first letter of a string
export const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.toLowerCase().split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

// Converts mg/dL to mmol/L or vice versa, rounded to 1 decimal, with optional unit string
export function convertToMmol(value: number, unit: Unit, addString: boolean = true) {
    if (unit === "mmol/L") return addString ? `${(value / 18).toFixed(1)} mmol/L` : (value / 18).toFixed(1);
    return addString ? `${value} mg/dL` : value;
}

// takes a status string as input and returns a corresponding CSS class based on the status level.
export const getStatusColorClass = (status: string, hex: boolean = false, textColor: boolean = false) => {
    switch (status.toLowerCase()) {
        case "very low":
            return !hex ? textColor ? "text-orange-700" : "bg-orange-700" : "#c2410c"
        case "low":
            return !hex ? textColor ? "text-orange-500" : "bg-orange-500" : "#f97316"
        case "normal":
            return !hex ? textColor ? "text-green-500" : "bg-green-500" : "#3B82F6"
        case "high":
            return !hex ? textColor ? "text-red-500" : "bg-red-500" : "#ef4444"
        case "very high":
            return !hex ? textColor ? "text-red-700" : "bg-red-700 " : "#b91c1c"
    }
}

// Returns glucose reading status and message based on the target range and unit
export const getReadingStatus = (value: number, unit: Unit, targetRange: TargetRange = { min: 70, max: 180 }) => {
    const reading = unit === "mmol/L" ? Number((value / 18).toFixed(1)) : value;
    const min = unit === "mmol/L" ? (targetRange.min ?? 3.9) : targetRange.min ?? 70;
    const max = unit === "mmol/L" ? (targetRange.max ?? 10) : targetRange.max ?? 180;

    const veryLow = unit === "mmol/L" ? 3.0 : 54;
    const veryHigh = unit === "mmol/L" ? 13.9 : 250;

    if (reading === undefined || reading === null) {
        return {
            status: "no reading",
            message: "No reading available yet. Please make sure to take a reading.",
            reading
        };
    } else if (reading < veryLow) {
        return {
            status: "very low",
            message: "Your glucose is critically low! Please take immediate action and consult your doctor.",
            reading

        };
    } else if (reading < min) {
        return {
            status: "low",
            message: "Your glucose is a bit low. Consider having a quick snack to bring it up.",
            reading

        };
    } else if (reading > veryHigh) {
        return {
            status: "very high",
            message: "Your glucose is very high! Please monitor closely and consider seeking medical advice.",
            reading

        };
    } else if (reading > max) {
        return {
            status: "high",
            message: "Your glucose level is high. You might want to review your meals or insulin dosage.",
            reading

        };
    } else {
        return {
            status: "normal",
            message: "Your glucose is within a healthy range. Keep up the great work!",
            reading

        };
    }
}