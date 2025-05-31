import { FormField } from "@/types/formTypes.js";

export const signInFields: FormField[] = [
    { name: "email", type: "email", label: "Email" },
    { name: "password", type: "password", label: "Password" },
];

export const contactFormFields: FormField[] = [
    { name: "firstName", type: "text", label: "First Name *", colSpan: 1 },
    { name: "lastName", type: "text", label: "Last Name *", colSpan: 1 },
    { name: "email", type: "email", label: "Email *", colSpan: 2 },
    { name: "message", type: "textarea", label: "Message", colSpan: 2 },
];

export const signUpFields: FormField[] = [
    {
        name: "firstName",
        type: "text",
        label: "First Name",
        colSpan: 1,
    },
    {
        name: "lastName",
        type: "text",
        label: "Last Name",
        colSpan: 1,
    },
    {
        name: "email",
        type: "email",
        label: "Email",
        colSpan: 2,
    },
    {
        name: "password",
        type: "password",
        label: "Password",
        colSpan: 2,
    },
];

export const forgotPasswordFields: FormField[] = [
    { name: "email", type: "email", label: "Email", colSpan: 2 },
]
export const OtpField: FormField[] = [
    { name: "otp", type: "otp", label: "", colSpan: 2 }
]

export const resetPasswordFields: FormField[] = [
    { name: "password", type: "password", label: "New Password", colSpan: 2 },
    { name: "confirmPassword", type: "password", label: "Confirm Password", colSpan: 2 }
]