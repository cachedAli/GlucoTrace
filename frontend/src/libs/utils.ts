import clsx, { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}