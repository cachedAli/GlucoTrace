import { lazy } from "react";


export const SignIn = lazy(() => import("../pages/userAuth/SignIn"))
export const SignUp = lazy(() => import("../pages/userAuth/SignUp"))
export const ForgotPassword = lazy(() => import("../pages/userAuth/ForgotPassword"))
export const VerifyEmail = lazy(() => import("../pages/userAuth/VerifyEmail"))
export const ResetPassword = lazy(() => import("../pages/userAuth/ResetPassword"))

