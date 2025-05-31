import { lazy } from "react";


// Site and User Auth
export const Form = lazy(() => import("../components/ui/common/Form"))

// Dashboard
export const DashboardLayout = lazy(() => import("../components/layout/dashboard/DashboardLayout"))
export const Sidebar = lazy(() => import("../components/layout/dashboard/sidebar/Sidebar"))
export const Header = lazy(() => import("../components/layout/dashboard/header/Header"))
export const DashboardOverlay = lazy(() => import("../components/layout/dashboard/DashboardOverlay"))

export const Overview = lazy(() => import("../pages/dashboard/overview/Overview"))
export const AddReading = lazy(() => import("../pages/dashboard/AddReading"))
export const Trends = lazy(() => import("../pages/dashboard/Trends"))
export const History = lazy(() => import("../pages/dashboard/history/History"))
export const Profile = lazy(() => import("../pages/dashboard/profile/Profile"))
export const Report = lazy(() => import("../pages/dashboard/report/Report"))
export const Settings = lazy(() => import("../pages/dashboard/settings/Settings"))





