import { Route, Routes } from "react-router-dom";

import {
  ForgotPassword,
  ResetPassword,
  SignIn,
  SignUp,
  VerifyEmail,
} from "./LazyRoutes";
import HomePage from "../pages/site/HomePage";
import LazyLoader from "../utils/LazyLoader";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/signin"
        element={
          <LazyLoader>
            <SignIn />
          </LazyLoader>
        }
      />
      <Route
        path="/signup"
        element={
          <LazyLoader>
            <SignUp />
          </LazyLoader>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <LazyLoader>
            <ForgotPassword />
          </LazyLoader>
        }
      />
      <Route
        path="/verify-email"
        element={
          <LazyLoader>
            <VerifyEmail />
          </LazyLoader>
        }
      />
      <Route
        path="/reset-password"
        element={
          <LazyLoader>
            <ResetPassword />
          </LazyLoader>
        }
      />
    </Routes>
  );
};

export default Router;
