import { IconType } from "react-icons";

export type StateProps = {
    title: string;
    value: number | string;
    description?: string;
    icon?: IconType;
    bgIcon?: IconType;
    trend?: number | string;
    timeFrame?: string;
    isOverview: boolean
    isSplitStat?: boolean;
    secondValue?: boolean | number;
    splitStat1?: string;
    splitStat2?: string;
};

export type StoredStat = {
    previous: Stats | null;
    current: Stats;
};

export type Stats = {
    value: string;
    high?: number;
    low?: number;
    morning?: number | null;
    evening?: number | null;
    trend?: string;
    lastUpdated: string;
    description: string;
};

export type Unit = "mg/dL" | "mmol/L";

export type TargetRange = {
    min: number;
    max: number;
};

export type StatName =
    | "sevenDayAverage"
    | "targetRange"
    | "highLow"
    | "monthlyChange"
    | "morningEvening";

export type ShareReport = {
    file?: File,
    email: string,
    fullName?: string,
    emailMessage?: string
} 