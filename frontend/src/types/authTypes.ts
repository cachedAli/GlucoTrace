import { string } from "zod";
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

export type VerifyOtpData = {
    otpCode: string;
}

export type ResendVerifyOtpData = {
    email: string | undefined
}

export type VerifyForgotPasswordData = {
    otp: string;
    email: string;
}

export type ResetPassword = {
    token: string | undefined;
    password: string;
}
