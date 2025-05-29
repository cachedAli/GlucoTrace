import { supabase } from "../config/supabaseClient";
import { sendResetPasswordEmail, sendResetPasswordSuccessEmail, sendResetPasswordVerificationEmail, sendVerificationEmail } from "../services/email/email.service";
import { Req, Res, Email } from "../types/user.types";
import { otpGenerator } from "../utils/otpGenerator";
import crypto from "crypto";


/* The function `sendOtp` sends a one-time password (OTP) to a specified email address and stores the OTP in a database for verification.*/
export const sendOtp = async (req: Req<{ email: Email, userId?: string }>, res: Res): Promise<void> => {
    const { email, userId } = req.body;

    if (!email) {
        res.status(400).json({ success: false, message: 'Email is required' });
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = otpGenerator("6");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Optional: Delete old OTPs for that email
    await supabase.from('otps').delete().eq('email', normalizedEmail);

    const { error: insertError } = await supabase.from('otps').insert([
        { user_id: userId, email: normalizedEmail, otp_code: otp, expires_at: expiresAt.toISOString() }
    ]);

    if (insertError) {
        res.status(500).json({ success: false, message: insertError.message });
        return;
    }

    try {
        await sendVerificationEmail(normalizedEmail, otp);
    } catch (err) {
        console.error('Failed to send verification email:', err);
        res.status(500).json({ success: false, message: 'Failed to send verification email' });
        return;
    }

    res.status(200).json({ success: true, message: `We've sent a 6-digit code to ${email}. Please enter it below to verify your account.` });
};

/* The function `verifyEmail` verifies a user's email using an OTP code and updates the user's metadata accordingly.*/
export const verifyEmail = async (req: Req<{ email?: Email, code: string }>, res: Res): Promise<void> => {
    const { email, code } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedCode = code.trim();

    try {
        if (!normalizedEmail || !normalizedCode) {
            res.status(400).json({ success: false, message: "OTP code is required" });
            return;
        }

        const { data: otpRecords, error } = await supabase
            .from("otps")
            .select("*")
            .eq("email", normalizedEmail)
            .eq("otp_code", normalizedCode)
            .gte("expires_at", new Date().toISOString())
            .limit(1);


        if (error) {
            res.status(500).json({ success: false, message: error.message })
            return;
        }

        if (!otpRecords || otpRecords.length === 0) {
            res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
            return
        }
        const otpRecord = otpRecords[0];

        if (!otpRecord.user_id) {
            res.status(400).json({ success: false, message: "User ID missing in OTP record" });
            return;
        }


        const { data: { user }, error: updatedError } = await supabase.auth.admin.updateUserById(otpRecord.user_id, {
            user_metadata: { otpVerified: true }
        });

        if (updatedError) {
            res.status(500).json({ success: false, message: updatedError.message })
            return;
        }
        await supabase.from("otps").delete().eq("email", normalizedEmail).eq('otp_code', normalizedCode)

        res.status(200).json({ success: true, message: `Welcome ${user?.user_metadata?.firstName} ${user?.user_metadata?.lastName}` });
        return;
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Error verifying email" });
        return;
    }

}

// Resend a verification OTP email to the user if their email is not yet verified.
export const resendVerificationEmail = async (req: Req<{ email?: Email }>, res: Res): Promise<void> => {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    try {
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }
        const { data, error } = await supabase.auth.admin.listUsers();

        const user = data?.users?.find((user) => user.email === normalizedEmail)

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        if (error) {
            res.status(400).json({ success: false, message: error.message })
        }

        if (user?.user_metadata?.otpVerified === true) {
            res.status(400).json({ success: false, message: "Email is already verified" });
            return;
        }

        const otp = otpGenerator("6");
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        const { error: upsertError } = await supabase.from("otps").upsert({
            email: normalizedEmail,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            user_id: user.id,
            created_at: new Date().toISOString()
        }, { onConflict: "email" })

        if (upsertError) {
            res.status(500).json({ success: false, message: upsertError.message });
            return;
        }

        await sendVerificationEmail(email, otp);

        res.status(200).json({ success: true, message: "OTP resent successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error resending verification email" });
    }
}

// Handles forgot password requests by generating and sending a password reset OTP to the user's email.
export const forgotPassword = async (req: Req<{ email?: Email }>, res: Res): Promise<void> => {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    try {
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
        }

        const { data, error } = await supabase.auth.admin.listUsers();

        const user = data?.users.find((user) => user.email === normalizedEmail);

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }

        if (error) {
            res.status(400).json({ success: false, message: error.message })
        }

        const otp = otpGenerator("4");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await supabase.from("password_resets").delete().eq("email", normalizedEmail);

        const { error: insertError } = await supabase.from("password_resets").insert([{
            email: normalizedEmail,
            user_id: user?.id,
            otp_code: otp,
            expires_at: expiresAt
        }])

        if (insertError) {
            res.status(500).json({ success: false, message: "Could not create OTP" });
            return;
        }

        sendResetPasswordVerificationEmail(normalizedEmail, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
        return

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Could not send OTP" })
    }
}

// Verifies the OTP for password reset, generates a reset token, stores it, and sends the password reset link via email.
export const forgotPasswordOtpVerification = async (req: Req<{ email: Email, code: string }>, res: Res): Promise<void> => {
    const { email, code } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedCode = code.trim();


    try {
        if (!email || !code) {
            res.status(400).json({ success: false, message: "OTP code is required" });
            return;
        }

        const { data: passwordResetRecords, error } = await supabase
            .from("password_resets")
            .select("*")
            .eq("email", normalizedEmail)
            .eq("otp_code", normalizedCode)
            .gte("expires_at", new Date().toISOString())
            .limit(1);


        if (error) {
            res.status(500).json({ success: false, message: error.message })
            return;
        }

        if (!passwordResetRecords || passwordResetRecords.length === 0) {
            res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
            return
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

        const { error: updateError } = await supabase
            .from("password_resets")
            .update({
                reset_token: resetToken,
                reset_token_expires_at: resetTokenExpiration,
            })
            .eq("email", normalizedEmail)
            .eq("otp_code", normalizedCode);

        if (updateError) {
            res.status(500).json({ success: false, message: updateError.message });
            return;
        }

        sendResetPasswordEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({
            success: true,
            message: "Please check your email for the password reset link.",
        });

        return;
    } catch (error) {
        res
            .status(400)
            .json({ success: false, message: "Error sending email" });

        return
    }
};

// Resets the user password using a valid reset token and sends a confirmation email upon success.
export const resetPassword = async (req: Req<{ token: string, password: string }>, res: Res): Promise<void> => {
    const { token, password } = req.body

    try {
        const { data, error } = await supabase.from("password_resets").select("*").eq("reset_token", token).gte("reset_token_expires_at", new Date().toISOString()).limit(1);

        if (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }

        if (!data || data.length === 0) {
            res.status(400).json({ success: false, message: "Invalid or expired reset token" });
            return;
        }

        const user = data[0];


        const { error: updateError } = await supabase.auth.admin.updateUserById(user.user_id, {
            password,
        })

        if (updateError) {
            res.status(500).json({ success: false, message: updateError.message });
            return;
        }

        sendResetPasswordSuccessEmail(user?.email)

        await supabase.from("password_resets").delete().eq("reset_token", token);

        res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.error("resetPassword error:", error);
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
}

// Resend a new OTP for password reset after validating the user email and updating the OTP record.
export const resendResetPasswordOtp = async (req: Req<{ email?: Email }>, res: Res): Promise<void> => {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    try {
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }

        const { data, error } = await supabase.auth.admin.listUsers();
        const user = data?.users?.find((u) => u.email === normalizedEmail);

        if (error) {
            res.status(400).json({ success: false, message: error.message });
            return;
        }

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const otp = otpGenerator("4");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        const { error: upsertError } = await supabase.from("password_resets").upsert({
            email: normalizedEmail,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            user_id: user.id,
            created_at: new Date().toISOString(),
        }, { onConflict: "email" });

        if (upsertError) {
            res.status(500).json({ success: false, message: upsertError.message });
            return;
        }

        await sendResetPasswordVerificationEmail(normalizedEmail, otp);


        res.status(200).json({ success: true, message: "OTP sent for password reset" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
