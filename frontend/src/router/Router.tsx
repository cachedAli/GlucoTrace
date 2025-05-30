import { Route, Routes } from "react-router-dom";

import ForgotPassword from "@/pages/userAuth/ForgotPassword";
import ResetPassword from "@/pages/userAuth/ResetPassword";
import VerifyEmail from "@/pages/userAuth/VerifyEmail";
import HomePage from "@/pages/site/HomePage";
import SignIn from "@/pages/userAuth/SignIn";
import SignUp from "@/pages/userAuth/SignUp";
import DashboardLayout from "@/components/layout/dashboard/DashboardLayout";
import Overview from "@/pages/dashboard/overview/Overview";
import AddReading from "@/pages/dashboard/AddReading";
import Report from "@/pages/dashboard/report/Report";
import Settings from "@/pages/dashboard/settings/Settings";
import Profile from "@/pages/dashboard/profile/Profile";
import History from "@/pages/dashboard/history/History";
import Trends from "@/pages/dashboard/Trends";
import AuthRedirectHandler from "./AuthRedirectHandler";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const Router = () => {
  return (
    <Routes>
      {/* Site */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />

      {/* Auth Page */}
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <VerifyEmail />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route path="/auth/callback" element={<AuthRedirectHandler />} />

      {/* Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="/dashboard/add-reading" element={<AddReading />} />
          <Route path="/dashboard/trends" element={<Trends />} />
          <Route path="/dashboard/history" element={<History />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/report" element={<Report />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
