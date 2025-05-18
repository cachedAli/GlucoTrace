import { z } from "zod";

export const SignInSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address. Please enter a valid email."),
    password: z.string().min(1, "Password is required.")
})

export const contactSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().optional(),
});

export const signUpSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address").trim(),
});

export const OtpSchema = (otpLength: 4 | 6) => z.object({
    otp: z.string()
        .length(otpLength, `OTP must be exactly ${otpLength} digits`)
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
        .regex(/[0-9]/, "Password must include at least one number."),
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }); 
