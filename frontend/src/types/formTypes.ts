import { ControllerRenderProps } from "react-hook-form";

export type FormField = {
    name: string;
    type: "text" | "email" | "password" | "textarea" | "otp" | "glucose" | "mealTiming" | "date" | "time";
    label: string;
    colSpan?: number;
    smColSpan?: boolean;
};

export interface CommonInputProps {
    label: string;
    field: ControllerRenderProps<any, string>;
    error?: string;
}