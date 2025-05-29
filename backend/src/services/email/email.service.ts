import { Email } from "../../types/user.types";
import { sender, transport } from "./email.config";
import { FORGOT_PASSWORD_EMAIL_TEMPLATE } from "./templates/forgotPasswordEmailTemplate";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./templates/passwordResetRequestTemplate";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./templates/resetPasswordSuccessTemplate";
import { VERIFICATION_EMAIL_TEMPLATE } from "./templates/verificationEmailTemplate";


export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = email;

    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}`,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}", verificationToken
            )
        });
        console.log("email send successfully", res)
    } catch (error) {
        console.log(error)
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendResetPasswordVerificationEmail = async (email: string | undefined, verificationToken: string) => {
    const recipient = email;

    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}`,
            to: recipient,
            subject: "Password Reset Verification",
            html: FORGOT_PASSWORD_EMAIL_TEMPLATE.replace(
                "{otpCode}", verificationToken
            )
        });
        console.log("email send successfully", res)
    } catch (error) {
        console.log(error)
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendResetPasswordEmail = async (email: Email, resetPasswordUrl: string) => {
    const recipient = email;

    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: recipient,
            subject: "Reset Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
                "{resetURL}",
                resetPasswordUrl
            ),
        });
        console.log("Email sent successfully", res);
    } catch (error) {
        throw new Error(`Error sending reset password email ${error}`);
    }
};

export const sendResetPasswordSuccessEmail = async (email: Email) => {
    const recipient = email;

    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: recipient,
            subject: "Your Password Has Been Successfully Reset",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
        console.log("Email sent successfully", res);
    } catch (error) {
        throw new Error(`Error sending email ${error}`);
    }
};