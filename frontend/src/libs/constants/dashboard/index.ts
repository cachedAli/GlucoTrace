import { preloadAddReading, preloadHistory, preloadProfile, preloadReport, preloadSettings, preloadTrends } from "@/router/preloadRoutes";
import { FormField } from "@/types/formTypes";
import {
  LayoutDashboard,
  CircleFadingPlus,
  ChartLine,
  History,
  User,
  Download,
  Settings,
  LogOut,
} from "lucide-react";


export const navLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  {
    to: "/dashboard/add-reading",
    icon: CircleFadingPlus,
    label: "Add Reading",
    onMouseEnter: () => preloadAddReading()
  },
  { to: "/dashboard/trends", icon: ChartLine, label: "Trends", onMouseEnter: () => preloadTrends() },
  { to: "/dashboard/history", icon: History, label: "History", onMouseEnter: () => preloadHistory() },
  { to: "/dashboard/profile", icon: User, label: "Profile", onMouseEnter: () => preloadProfile() },
  { to: "/dashboard/report", icon: Download, label: "Report", onMouseEnter: () => preloadReport() },
  { to: "/dashboard/settings", icon: Settings, label: "Settings", onMouseEnter: () => preloadSettings() },
  { to: "", icon: LogOut, label: "Logout" },

];
// Setup Page
export const setupFields: FormField[] = [
  { name: "age", type: "number", label: "Age", colSpan: 1, smColSpan: true },
  { name: "gender", type: "select", label: "Gender", colSpan: 1, smColSpan: true, options: ["Male", "Female", "other"] },
  { name: "diabetesType", type: "select", label: "Diabetes Type", colSpan: 1, smColSpan: true, options: ["Type 1", "Type 2", "Pre-diabetes"] },
  { name: "unit", type: "select", label: "Preferred Unit", colSpan: 1, smColSpan: true, options: ["mg/dL", "mmol/L"] },
  { name: "diagnosisDate", type: "date", label: "Diagnosis Date", colSpan: 2, smColSpan: true },
];

// Add Reading Page
export const addReadingFields: FormField[] = [
  { name: "glucose", type: "glucose", label: "Glucose Level", colSpan: 1, smColSpan: true },
  { name: "mealTiming", type: "select", label: "Meal Timing", colSpan: 1, smColSpan: true, customLabel: "Custom", enableCustom: true, maxCustomLength: 25, options: ["Before Meal", "After Meal", "Fasting", "Custom"] },
  { name: "date", type: "date", label: "Select a day", colSpan: 1, smColSpan: true },
  { name: "time", type: "time", label: "Select time", colSpan: 1, smColSpan: true },
  { name: "note", type: "textarea", label: "Add a note", colSpan: 2 },
];

// Profile Page
export const profileUserInfoFields: FormField[] = [
  { name: "firstName", type: "text", label: "First Name", colSpan: 1, smColSpan: true },
  { name: "lastName", type: "text", label: "Last Name", colSpan: 1, smColSpan: true },
  { name: "age", type: "number", label: "Age", colSpan: 1, smColSpan: true },
  { name: "gender", type: "select", label: "Gender", colSpan: 1, smColSpan: true, options: ["Male", "Female", "other"] },
  { name: "diabetesType", type: "select", label: "Diabetes Type", colSpan: 1, smColSpan: true, options: ["Type 1", "Type 2", "Pre-diabetic"] },
  { name: "diagnosisDate", type: "date", label: "Diagnosis Date", colSpan: 1, smColSpan: true },
];

export const profileGlucosePreferenceFields: FormField[] = [
  { name: "unit", type: "select", label: "Preferred Unit", colSpan: 2, smColSpan: true, options: ["mg/dL", "mmol/L"] },
  { name: "targetMin", type: "glucose", label: "Min Target Range", colSpan: 1, smColSpan: true },
  { name: "targetMax", type: "glucose", label: "Max Target Range", colSpan: 1, smColSpan: true },
]

// Report Page
export const shareReportFields: FormField[] = [
  { name: "email", type: "text", label: "Send email to:", colSpan: 2, smColSpan: true },
  { name: "emailMessage", type: "textarea", label: "Message", colSpan: 2, smColSpan: true }
];