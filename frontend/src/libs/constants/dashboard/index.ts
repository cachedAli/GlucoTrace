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
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
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
    { to: "/signin", icon: LogOut, label: "Logout" },
    
];