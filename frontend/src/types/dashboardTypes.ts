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
    secondValue?: boolean;
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
    trend?: string;
    lastUpdated: string;
    description: string;
};