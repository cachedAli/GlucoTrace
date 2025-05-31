import { supabase } from "../config/supabaseClient.js";
import { sendReportEmail } from "../services/email/email.service.js";
import { Email, MedicalProfile, Reading, Req, Res } from "../types/user.types.js";


// 
export const updateDarkMode = async (req: Req<{ darkMode: boolean }>, res: Res) => {
    const { darkMode } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (error) {
            res.status(400).json({ success: false, message: error.message })
            return;
        }

        const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
                ...user.user_metadata,
                darkMode
            }
        })
        if (updateError) {
            res.status(500).json({ success: false, message: updateError.message });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Dark mode ${darkMode ? "enabled" : "disabled"} successfully`,
            data
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const uploadAvatar = async (req: Req<{ file: Express.Multer.File }>, res: Res): Promise<void> => {
    const file = req.file
    const token = req.headers?.authorization?.replace("Bearer ", "")

    try {


        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" })
            return;
        }
        if (error) {
            res.status(400).json({ success: false, message: error.message })
            return;
        }
        if (!file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }

        const timestamp = Date.now()
        const fileExtension = file.originalname.split(".").pop();
        const filePath = `${user.id}/${timestamp}.${fileExtension}`


        const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file.buffer, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.mimetype
        })

        if (uploadError) {
            res.status(500).json({ success: false, message: uploadError.message });
            return
        }

        const { data: publicUrlData } = await supabase.storage.from("avatars").getPublicUrl(filePath);

        const avatarUrl = publicUrlData.publicUrl;

        const oldAvatarUrl = user?.user_metadata?.custom_avatar_url;
        if (oldAvatarUrl) {
            const oldPath = decodeURIComponent(new URL(oldAvatarUrl).pathname.split("/").slice(6).join("/"))
            await supabase.storage.from("avatars").remove([oldPath])
        }

        const { error: userUpdateError } = await supabase.auth.admin.updateUserById(user?.id, {
            user_metadata: {
                custom_avatar_url: avatarUrl
            }
        })


        if (userUpdateError) {
            res.status(500).json({ success: false, message: userUpdateError.message });
            return;
        }

        res.status(200).json({ success: true, message: "Profile picture updated successfully", avatarUrl });

        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const medicalProfile = async (req: Req<MedicalProfile>, res: Res): Promise<void> => {
    const { diabetesType, age, gender, bloodSugarUnit, diagnosisDate } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "")

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (!diabetesType || !age || !gender || !bloodSugarUnit || !diagnosisDate) {
            res.status(400).json({ success: false, message: "All fields are required." });
            return;
        }
        if (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }

        const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
                medicalProfile: {
                    diabetesType,
                    age,
                    gender,
                    bloodSugarUnit,
                    diagnosisDate,
                    targetBloodSugarRange: { max: bloodSugarUnit === "mg/dL" ? 200 : 11.11, min: bloodSugarUnit === "mg/dL" ? 70 : 3.9 }
                },
                hasCompletedSetup: true
            }
        })

        if (updateError) {
            res.status(500).json({ success: false, message: updateError.message });
            return;
        }

        res.status(200).json({ success: true, message: "You're all set! Your medical profile has been successfully updated." });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export const updateProfile = async (
    req: Req<{ firstName?: string; lastName?: string } & MedicalProfile>,
    res: Res
): Promise<void> => {
    const {
        firstName,
        lastName,
        diabetesType,
        age,
        gender,
        diagnosisDate,
    } = req.body;

    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }

        const previousMeta = user.user_metadata || {};
        const previousProfile = previousMeta.medicalProfile || {};

        const updatedMedicalProfile = {
            ...previousProfile,
            ...(diabetesType !== undefined && { diabetesType }),
            ...(age !== undefined && { age }),
            ...(gender !== undefined && { gender }),
            ...(diagnosisDate !== undefined && { diagnosisDate }),
        };

        const updatedMetadata = {
            ...previousMeta,
            ...(firstName !== undefined && firstName !== "" && { firstName }),
            ...(lastName !== undefined && lastName !== "" && { lastName }),
            medicalProfile: updatedMedicalProfile,
        };

        const { error: updateError } =
            await supabase.auth.admin.updateUserById(user.id, {
                user_metadata: {
                    ...updatedMetadata
                }

            });

        if (updateError) {
            res.status(500).json({ success: false, message: updateError.message });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateGlucosePreference = async (
    req: Req<MedicalProfile>,
    res: Res
): Promise<void> => {
    const {
        bloodSugarUnit,
        targetBloodSugarRange,
    } = req.body;

    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }

        const previousMeta = user.user_metadata || {};
        const previousProfile = previousMeta.medicalProfile || {};

        const updatedMedicalProfile = {
            ...previousProfile,
            ...(bloodSugarUnit !== undefined && { bloodSugarUnit }),
            ...(targetBloodSugarRange !== undefined && { targetBloodSugarRange }),
        };

        const updatedMetadata = {
            ...previousMeta,
            medicalProfile: updatedMedicalProfile,
        };

        const { error: updateError } =
            await supabase.auth.admin.updateUserById(user.id, {
                user_metadata: {
                    ...updatedMetadata
                }

            });

        if (updateError) {
            res.status(500).json({ success: false, message: updateError.message });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const addReading = async (
    req: Req<Reading>,
    res: Res
): Promise<void> => {
    const {
        mealTiming, timestamp, value, note
    } = req.body;

    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }

        const { data, error: insertError } = await supabase.from("readings").insert({
            user_id: user.id,
            value,
            timestamp,
            meal_timing: mealTiming,
            note
        }).select();


        if (insertError) {
            res.status(500).json({ success: false, message: insertError.message });
            return;
        }

        res.status(200).json({ success: true, message: "Reading added successfully.", data });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error." });
        return
    }
}

export const editReading = async (
    req: Req<Reading>,
    res: Res
): Promise<void> => {
    const {
        id, mealTiming, timestamp, value, note
    } = req.body;

    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }

        const { data, error: updateError } = await supabase.from("readings").update({
            meal_timing: mealTiming,
            timestamp,
            value,
            note
        }).eq("id", id).select()


        if (updateError) {
            res.status(500).json({ success: false, message: updateError.message });
            return;
        }

        if (!data || data.length === 0) {
            res.status(404).json({ success: false, message: "Reading not found." });
            return;
        }

        res.status(200).json({ success: true, message: "Reading updated successfully.", data });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error." });
        return
    }
}

export const deleteReading = async (
    req: Req<Reading>,
    res: Res
): Promise<void> => {
    const {
        id
    } = req.body;

    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }

        const { data, error: deleteError } = await supabase.from("readings").delete().eq("id", id).select();

        if (deleteError) {
            res.status(500).json({ success: false, message: deleteError.message });
            return;
        }

        if (!data || data.length === 0) {
            res.status(404).json({ success: false, message: "Reading not found." });
            return;
        }

        res.status(200).json({ success: true, message: "Reading deleted successfully.", data });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error." });
        return
    }
}

export const shareReportWithEmail = async (req: Req<{ file: Express.Multer.File, email: Email, fullName: string, emailMessage?: string }>, res: Res): Promise<void> => {
    const file = req.file;
    const { email, fullName, emailMessage } = req.body;
    console.log(req)
    try {
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required!" });
            return;
        }

        await sendReportEmail(email, fullName, emailMessage, file!)

        res.status(200).json({ success: true, message: "Report sent successfully." })
        return;
    } catch (error) {
        console.log("share report error:", error)
        res.status(500).json({ success: false, message: "Server error" });
        return;
    }
}

export const deleteAccount = async (
    req: Req,
    res: Res
): Promise<void> => {

    const token = req.headers.authorization?.replace("Bearer ", "");
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }


        // Delete picture
        const oldAvatarUrl = user?.user_metadata?.custom_avatar_url;
        if (oldAvatarUrl) {
            const url = new URL(oldAvatarUrl);
            const fullPath = decodeURIComponent(url.pathname.split("/").slice(6).join("/"));

            // Delete individual picture
            await supabase.storage.from("avatars").remove([fullPath]);

            // Delete entire folder
            const folderPath = fullPath.split("/").slice(0, -1).join("/");

            const { data: files, error: listError } = await supabase.storage
                .from("avatars")
                .list(folderPath);

            if (listError) {
                console.error("Error listing folder contents:", listError.message);
                res.status(500).json({ success: false, message: listError.message });
                return;
            }

            if (files && files.length > 0) {
                const pathsToDelete = files.map((file) => `${folderPath}/${file.name}`);
                const { error: deleteError } = await supabase.storage
                    .from("avatars")
                    .remove(pathsToDelete);

                if (deleteError) {
                    console.error("Error deleting folder contents:", deleteError.message);
                    res.status(500).json({ success: false, message: deleteError.message });
                    return;
                }
            }
        }

        // Delete readings
        const { error: readingsError } = await supabase
            .from('readings')
            .delete()
            .eq('user_id', user.id);

        if (readingsError) {
            res.status(500).json({ success: false, message: readingsError.message });
            return;
        }

        // Delete health stats
        const { error: healthError } = await supabase
            .from('health_stats')
            .delete()
            .eq('user_id', user.id);

        if (healthError) {
            res.status(500).json({ success: false, message: healthError.message });
            return;
        }

        // Delete otps
        const { error: otpError } = await supabase
            .from('otps')
            .delete()
            .eq('id', user.id);

        if (otpError) {
            res.status(500).json({ success: false, message: otpError.message });
            return;
        }

        // delete password resets
        const { error: passwordResetError } = await supabase
            .from('password_resets')
            .delete()
            .eq('id', user.id);

        if (passwordResetError) {
            res.status(500).json({ success: false, message: passwordResetError.message });
            return;
        }

        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

        if (deleteError) {
            console.log("by", deleteError)
            res.status(500).json({ success: false, message: deleteError.message });
            return;
        }


        res.status(200).json({ success: true, message: "Account deleted successfully." })
        return

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};