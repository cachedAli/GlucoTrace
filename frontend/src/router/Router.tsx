import { Route, Routes } from "react-router-dom";

import ForgotPassword from "@/pages/userAuth/ForgotPassword";
import ResetPassword from "@/pages/userAuth/ResetPassword";
import VerifyEmail from "@/pages/userAuth/VerifyEmail";
import HomePage from "@/pages/site/HomePage";
import SignIn from "@/pages/userAuth/SignIn";
import SignUp from "@/pages/userAuth/SignUp";
import DashboardLayout from "@/components/layout/dashboard/DashboardLayout";
import Overview from "@/pages/dashboard/Overview";
import AddGlucose from "@/pages/dashboard/AddReading";
import AddReading from "@/pages/dashboard/AddReading";
import Report from "@/pages/dashboard/Report";
import Settings from "@/pages/dashboard/Settings";
import Profile from "@/pages/dashboard/Profile";
import History from "@/pages/dashboard/History";
import Trends from "@/pages/dashboard/Trends";

const Router = () => {
  return (
    <Routes>
      {/* Site */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Page */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="/dashboard/add-reading" element={<AddReading />} />
        <Route path="/dashboard/trends" element={<Trends />} />
        <Route path="/dashboard/history" element={<History />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/report" element={<Report />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default Router;
