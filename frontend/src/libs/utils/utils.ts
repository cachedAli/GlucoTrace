import { twMerge } from "tailwind-merge"
import clsx, { ClassValue } from "clsx"

import { Unit } from "@/types/dashboardTypes";


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
export const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
        case "very low":
            return "bg-red-700 "
        case "low":
            return "bg-orange-500"
        case "normal":
            return "bg-green-500"
        case "high":
            return "bg-red-500"
        case "very high":
            return "bg-red-700"
    }
}