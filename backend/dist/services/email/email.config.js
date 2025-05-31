import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();
export const transport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
export const sender = {
    email: process.env.EMAIL_USER,
    name: "GlucoTrace"
};
