import { z } from "zod";

export const addReadingSchema = z.object({
  glucose: z.number().min(1, "Glucose is required")
    .max(2000, "Glucose should be below 2000 mg/dL"),
  mealTiming: z.union([
    z.enum(["None", "Before Meal", "After Meal", "Fasting"]),
    z.object({
      custom: z.string().min(1, "Custom meal timing is required")
        .max(25, "Custom timing should be 25 characters or less")
    })
  ]),
  date: z.coerce.date({ required_error: "Date is required" }),
  time: z.string()
    .refine((value) => {
      if (!value) return false;
      const [hours, minutes] = value.split(':').map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }, {
      message: "Invalid time format (HH:mm)"
    }),
  note: z.string().optional()
})