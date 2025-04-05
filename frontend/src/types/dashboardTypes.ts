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
};
