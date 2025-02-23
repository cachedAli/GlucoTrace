import { lazy } from "react";


export const SignIn = lazy(() => import("../pages/userAuth/SignIn"))
export const SignUp = lazy(() => import("../pages/userAuth/SignUp"))
export const ForgotPassword = lazy(() => import("../pages/userAuth/ForgotPassword"))
export const OTP = lazy(() => import("../layout/userAuth/Otp"))
export const EmailSent = lazy(() => import("../layout/userAuth/EmailSent"))
export const VerifyEmail = lazy(() => import("../pages/userAuth/VerifyEmail"))
export const ResetPassword = lazy(() => import("../pages/userAuth/ResetPassword"))
export const Form = lazy(() => import("../ui/Form"))

export const preloadSignIn = () => import("../pages/userAuth/SignIn")
export const preloadSignUp = () => import("../pages/userAuth/SignUp")
