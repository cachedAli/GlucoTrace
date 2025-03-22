export type FormField = {
    name: string;
    type: "text" | "email" | "password" | "textarea" | "otp";
    label: string;
    colSpan?: number;
};

