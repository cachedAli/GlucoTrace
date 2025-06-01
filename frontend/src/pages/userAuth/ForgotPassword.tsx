import { useState } from "react";

import { forgotPasswordFields } from "@/libs/constants/authPage/formFields";
import { forgotPasswordSchema } from "@/libs/validations/authSchema";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import Otp from "@/components/layout/userAuth/Otp";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";

type Data = {
  email: string;
};

type OtpData = {
  email: string;
  otp: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState<string>("");
  const resendForgotPasswordOtp = useAuthStore(
    (state) => state.resendForgotPasswordOtp
  );

  const {
    forgotPassword,
    forgotPasswordLoading,
    verifyForgotPasswordEmail,
    verifyForgotPasswordLoading,
  } = useAuthStore();

  const description = `Enter your email address to receive a verification code for resetting your password.`;

  const submitForm = async (data: Data) => {
    const { email } = data;
    try {
      const success = await forgotPassword({ email });
      if (success && step !== "otp") {
        setEmail(email);
        setStep("otp");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOtp = async (data: OtpData) => {
    const { otp } = data;

    try {
      const success = await verifyForgotPasswordEmail({ email, otp });
      if (success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <>
      {step === "email" ? (
        <AuthLayout
          currentPage="Forgot Password"
          formTitle="Forgot Password?"
          formDescription={description}
          isSignIn={false}
          resetPage={true}
        >
          <LazyLoader
            fallback={() => (
              <FormSkeleton fields={forgotPasswordFields} transparentButton />
            )}
          >
            <Form
              fields={forgotPasswordFields}
              schema={forgotPasswordSchema}
              onSubmit={submitForm}
              buttonLabel="Send Verification Code"
              googleAuth={false}
              loading={forgotPasswordLoading}
              backButtonLabel="Back to login"
            />
          </LazyLoader>
        </AuthLayout>
      ) : (
        <Otp
          otpLength={4}
          currentPage="Forgot Password"
          handleSubmit={handleOtp}
          loading={verifyForgotPasswordLoading}
          resendOtp={() => resendForgotPasswordOtp({ email })}
        />
      )}
    </>
  );
};

export default ForgotPassword;
