import { forgotPasswordFields } from "@/components/utils/constants/authPage/formFields";
import { forgotPasswordSchema } from "@/components/utils/validations/authSchema";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import { OTP } from "@/components/router/LazyRoutes";
import Form from "@/components/ui/Form";
import { useState } from "react";

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
          <Form
            fields={forgotPasswordFields}
            schema={forgotPasswordSchema}
            onSubmit={submitForm}
            buttonLabel="Send Verification Code"
            googleAuth={false}
            backButtonLabel="Back to login"
          />
        </AuthLayout>
      ) : (
        <OTP otpLength={4} currentPage="Forgot Password" />
      )}
    </>
  );
};

export default ForgotPassword;
