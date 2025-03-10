import { useState } from "react";

import { forgotPasswordFields } from "@/libs/constants/authPage/formFields";
import { forgotPasswordSchema } from "@/libs/validations/authSchema";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import Otp from "@/components/layout/userAuth/Otp";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";

type Data = {
  email: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const description = `Enter your email address to receive a verification code for resetting your password.`;

  const submitForm = (data: Data) => {
    console.log("Forgot Password form: ", data);
    setStep("otp");
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
              backButtonLabel="Back to login"
            />
          </LazyLoader>
        </AuthLayout>
      ) : (
        <Otp otpLength={4} currentPage="Forgot Password" />
      )}
    </>
  );
};

export default ForgotPassword;
