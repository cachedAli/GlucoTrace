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
  },
  { to: "/dashboard/trends", icon: ChartLine, label: "Trends" },
  { to: "/dashboard/history", icon: History, label: "History" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
  { to: "/dashboard/report", icon: Download, label: "Report" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  { to: "", icon: LogOut, label: "Logout" },

];

// Add Reading Page
export const addReadingFields: FormField[] = [
  { name: "glucose", type: "glucose", label: "Glucose Level", colSpan: 1, smColSpan: true },
  { name: "mealTiming", type: "select", label: "Meal Timing", colSpan: 1, smColSpan: true, customLabel: "Custom", enableCustom: true, maxCustomLength: 25, options: ["Before Meal", "After Meal", "Fasting"] },
  { name: "date", type: "date", label: "Select a day", colSpan: 1, smColSpan: true },
  { name: "time", type: "time", label: "Select time", colSpan: 1, smColSpan: true },
  { name: "note", type: "textarea", label: "Add a note", colSpan: 2 },
];

