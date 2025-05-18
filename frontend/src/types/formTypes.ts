import { ControllerRenderProps } from "react-hook-form";

export interface BaseProps {
    type?:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "otp"
    | "glucose"
    | "select"
    | "date"
    | "number"
    | "time";
    error?: string;
    label: string;
    options?: string[];
    enableCustom?: boolean;
    customLabel?: string;
    maxCustomLength?: number;
    useDefault?: boolean;
    defaultValue?: string;
}

export interface FormField extends BaseProps {
    name: string;
    colSpan?: number;
    smColSpan?: boolean;
};

export interface CommonInputProps {
    label: string;
    field: ControllerRenderProps<any, string>;
    error?: string;
}