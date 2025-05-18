import { coerce, z } from "zod";


export const setupSchema = z.object({
  age: z
    .number()
    .min(1, "Age must be at least 1")
    .max(110, "Age must be <= 110"),

  gender: z.enum(["Male", "Female", "other"], {
    required_error: "Gender is required",
  }),

  diabetesType: z.enum(["Type 1", "Type 2", "Pre-diabetes"], {
    required_error: "Diabetes type is required",
  }),

  diagnosisDate: z.coerce.date({
    required_error: "Diagnosis date is required",
    invalid_type_error: "Please enter a valid date",
  }),

  unit: z.enum(["mg/dL", "mmol/L"], {
    required_error: "Unit is required",
  }),

});


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

export const profileUserInfoSchema = z.object({
  firstName: z.string().trim().min(1).max(50).optional().or(z.literal("")),
  lastName: z.string().trim().min(1).max(50).optional().or(z.literal("")),
  age: z.union([z.number().min(1).max(110), z.literal("")]).transform(val => (val === "" ? undefined : val)),
  gender: z.enum(["Male", "Female", "other"]).optional().or(z.literal("")),
  diabetesType: z.enum(["Type 1", "Type 2", "Pre-diabetes"]).optional().or(z.literal("")),
  diagnosisDate: z.coerce.date().optional()
});



export const profileGlucosePreferenceSchema = (unit: "mg/dL" | "mmol/L") => {
  const isMg = unit === "mg/dL";
  const minAllowed = isMg ? 50 : 2.8;
  const maxAllowed = isMg ? 300 : 16.7;

  return z
    .object({
      unit: z.enum(["mg/dL", "mmol/L"]).optional(),
      targetMin: z
        .number()
        .min(minAllowed, { message: `Min must be at least ${minAllowed} for ${unit}` })
        .max(maxAllowed, { message: `Min must be at most ${maxAllowed} for ${unit}` })
        .optional(),
      targetMax: z
        .number()
        .min(minAllowed, { message: `Max must be at least ${minAllowed} for ${unit}` })
        .max(maxAllowed, { message: `Max must be at most ${maxAllowed} for ${unit}` })
        .optional(),
    })
    .refine(
      (data) =>
      (data.targetMin === undefined ||
        data.targetMax === undefined ||
        data.targetMax >= data.targetMin),
      {
        message: "Max must be greater than or equal to Min",
        path: ["targetMax"],
      }
    );
};