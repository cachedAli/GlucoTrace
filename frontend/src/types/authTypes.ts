export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePic?: string;
    darkMode: boolean;

    medicalProfile?: {
        diabetesType: "Type 1" | "Type 2" | "Pre-diabetes";
        bloodSugarUnit: "mg/dl" | "mmol/L";
        weight: number;
        height: number;
        insulinDependent: boolean;
        conditions: string[];
        targetBloodSugarRange: { min: number; max: number };
    }
}

export type SignInData = {
    email: string;
    password: string;
};

export type SignUpData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePic?: string;
};

