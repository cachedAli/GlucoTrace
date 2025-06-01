import { Route, Routes } from "react-router-dom";

import ForgotPassword from "@/pages/userAuth/ForgotPassword";
import ResetPassword from "@/pages/userAuth/ResetPassword";
import VerifyEmail from "@/pages/userAuth/VerifyEmail";
import HomePage from "@/pages/site/HomePage";
import SignIn from "@/pages/userAuth/SignIn";
import SignUp from "@/pages/userAuth/SignUp";

import {
  AddReading,
  DashboardLayout,
  History,
  Overview,
  Profile,
  Report,
  Settings,
  Trends,
} from "./LazyRoutes";
import DashboardPagesSkeleton from "@/components/ui/skeleton/dashboard/DashboardPagesSkeleton";
import DashboardSkeleton from "@/components/ui/skeleton/dashboard/DashboardSkeleton";
import { GlobalErrorPage, NotFoundPage } from "./ErrorPage";
import AuthRedirectHandler from "./AuthRedirectHandler";
import ProtectedRoute from "./ProtectedRoute";
import LazyLoader from "@/libs/LazyLoader";
import PublicRoute from "./PublicRoute";

const Router = () => {
  return (
    <Routes>
      {/* Site */}
      <Route
        path="/"
        ErrorBoundary={GlobalErrorPage}
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

      {/* Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />

      {/* Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <LazyLoader fallback={DashboardSkeleton}>
              <DashboardLayout />
            </LazyLoader>
          }
        >
          <Route
            index
            element={
              <LazyLoader fallback={DashboardPagesSkeleton}>
                <Overview />
              </LazyLoader>
            }
          />
          <Route
            path="/dashboard/add-reading"
            element={
              <LazyLoader fallback={DashboardPagesSkeleton}>
                <AddReading />
              </LazyLoader>
            }
          />
          <Route
            path="/dashboard/trends"
            element={
              <LazyLoader fallback={DashboardPagesSkeleton}>
                <Trends />
              </LazyLoader>
            }
          />
          <Route
            path="/dashboard/history"
            element={
              <LazyLoader fallback={DashboardPagesSkeleton}>
                <History />
              </LazyLoader>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <LazyLoader>
                <Profile />
              </LazyLoader>
            }
          />
          <Route
            path="/dashboard/report"
            element={
              <LazyLoader>
                <Report />
              </LazyLoader>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <LazyLoader>
                <Settings />
              </LazyLoader>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
