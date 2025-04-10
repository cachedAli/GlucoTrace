import { twMerge } from "tailwind-merge"
import clsx, { ClassValue } from "clsx"


// Combines class names using clsx and merges Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Capitalizes the first letter of a string
export const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}

