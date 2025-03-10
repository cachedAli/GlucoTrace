import { Route, Routes } from "react-router-dom";

import ForgotPassword from "@/pages/userAuth/ForgotPassword";
import ResetPassword from "@/pages/userAuth/ResetPassword";
import VerifyEmail from "@/pages/userAuth/VerifyEmail";
import HomePage from "@/pages/site/HomePage";
import SignIn from "@/pages/userAuth/SignIn";
import SignUp from "@/pages/userAuth/SignUp";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default Router;
