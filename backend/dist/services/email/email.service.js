import dotenv from "dotenv";
import { sender, transport } from "./email.config.js";
import { FORGOT_PASSWORD_EMAIL_TEMPLATE } from "./templates/forgotPasswordEmailTemplate.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./templates/passwordResetRequestTemplate.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./templates/resetPasswordSuccessTemplate.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./templates/verificationEmailTemplate.js";
dotenv.config();
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = email;
    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}`,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        });
        console.log("email send successfully", res);
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};
export const sendResetPasswordVerificationEmail = async (email, verificationToken) => {
    const recipient = email;
    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}`,
            to: recipient,
            subject: "Password Reset Verification",
            html: FORGOT_PASSWORD_EMAIL_TEMPLATE.replace("{otpCode}", verificationToken)
        });
        console.log("email send successfully", res);
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};
export const sendResetPasswordEmail = async (email, resetPasswordUrl) => {
    const recipient = email;
    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: recipient,
            subject: "Reset Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetPasswordUrl),
        });
        console.log("Email sent successfully", res);
    }
    catch (error) {
        throw new Error(`Error sending reset password email ${error}`);
    }
};
export const sendResetPasswordSuccessEmail = async (email) => {
    const recipient = email;
    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: recipient,
            subject: "Your Password Has Been Successfully Reset",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
        console.log("Email sent successfully", res);
    }
    catch (error) {
        throw new Error(`Error sending email ${error}`);
    }
};
export const sendReportEmail = async (email, fullName, customMessage, file) => {
    const recipient = email;
    const plainText = [
        `Hello,`,
        ``,
        `${fullName} has shared a glucose report with you.`,
        ...(customMessage
            ? [
                ``,
                `Message from ${fullName}:`,
                customMessage.trim(),
            ]
            : []),
        ``,
        `Please find the attached report below.`,
        ``,
        `Thanks`
    ].join('\n');
    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: recipient,
            subject: "Glucose Report",
            text: plainText,
            attachments: [
                {
                    filename: file.originalname || "glucose_report.pdf",
                    content: file.buffer,
                    contentType: file.mimetype,
                },
            ],
        });
        console.log("Email sent successfully:", res);
    }
    catch (error) {
        console.error("Failed to send email:", error);
    }
};
export const sendContactEmail = async (email, fullName, message) => {
    const recipient = process.env.EMAIL_PERSONAL;
    const plainText = [
        `You have received a new message from the contact form.`,
        ``,
        `Name: ${fullName}`,
        `Email: ${email}`,
        ``,
        `Message:`,
        `${message}`,
        ``,
    ].join('\n');
    try {
        const res = await transport.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: recipient,
            replyTo: email,
            subject: `New Contact Form Message From ${fullName}`,
            text: plainText
        });
        console.log("Email sent successfully:", res);
    }
    catch (error) {
        console.error("Failed to send email:", error);
        return;
    }
};
