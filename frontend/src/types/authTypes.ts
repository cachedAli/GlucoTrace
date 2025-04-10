import { MedicalProfile } from "./userTypes";


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
    medicalProfile?: MedicalProfile;
};

