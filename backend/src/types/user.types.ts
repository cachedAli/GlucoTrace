import { Request, Response } from "express";

export type Req<T = any> = Request<{}, {}, T>;
export type Res<T = any> = Response<T>;

export type Email = string;

export type MedicalProfile = {
    diabetesType?: "Type 1" | "Type 2" | "Pre-diabetes";
    age?: number;
    gender?: "Male" | "Female" | "Other";
    bloodSugarUnit?: "mg/dL" | "mmol/L";
    diagnosisDate?: Date | string;
    targetBloodSugarRange?: { min: number; max: number };
}

export type Reading = {
    id: string;
    value: number;
    timestamp: string | Date;
    mealTiming: "Before Meal" | "After Meal" | "Fasting" | { custom: string };
    note?: string;
    userId: string;
    createdAt: string | Date;
}