export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePic?: string;
    darkMode: boolean;

    medicalProfile?: MedicalProfile
}

export type Reading = {
    id: string;
    value: number;
    timestamp: string | Date;
    mealTiming: "Before Meal" | "After Meal" | "Fasting" | { custom: string };
    note?: string;
    userId: string;
}

export type MedicalProfile ={
    diabetesType: "Type 1" | "Type 2" | "Pre-diabetes";
    bloodSugarUnit: "mg/dL" | "mmol/L";
    weight?: number;
    height?: number;
    insulinDependent?: boolean;
    conditions?: string[];
    targetBloodSugarRange: { min: number; max: number };
}