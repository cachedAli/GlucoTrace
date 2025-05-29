import express from 'express';
import multer from "multer";

import { addReading, deleteReading, editReading, medicalProfile, updateDarkMode, updateGlucosePreference, updateProfile, uploadAvatar } from '../controllers/dashboard.controller.js';

const userRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage })

userRouter.post("/dark-mode", updateDarkMode)
userRouter.post("/upload-avatar", upload.single("file"), uploadAvatar)
userRouter.post("/medical-profile", medicalProfile)
userRouter.put("/update-profile", updateProfile)
userRouter.put("/update-glucose-preference", updateGlucosePreference)

userRouter.post("/add-reading",addReading)
userRouter.put("/edit-reading",editReading)
userRouter.delete("/delete-reading",deleteReading)










export default userRouter