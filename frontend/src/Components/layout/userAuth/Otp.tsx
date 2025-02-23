import { OtpField } from "@/components/utils/constants/authPage/formFields";
import { OtpSchema } from "@/components/utils/validations/authSchema";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import { EmailSent } from "@/components/router/LazyRoutes";
import Form from "@/components/ui/Form";
import { useState } from "react";

type Data = {
  otp: string;
};

type OtpProps = {
  otpLength: 4 | 6;
  currentPage: string;
};

const Otp = ({ otpLength = 4, currentPage = "Forgot Password" }: OtpProps) => {
  const [step, setStep] = useState<"otp" | "emailSentMessage">("otp");

  const onSubmit = (data: Data) => {
    console.log("Form Data:", data);

    if (otpLength === 4) {
      setStep("emailSentMessage");
    }
  };

  const description = `Enter the ${otpLength}-digit code sent to your device.`;

  return step === "otp" ? (
    <AuthLayout
      isSignIn={false}
      currentPage={currentPage}
      formTitle="Verify OTP"
      formDescription={description}
      resetPage={true}
    >
      <Form
        resendOtp
        fields={OtpField}
        onSubmit={onSubmit}
        schema={OtpSchema(otpLength)}
        buttonLabel="Confirm Code"
        googleAuth={false}
        otpLength={otpLength}
        className="!flex-row items-center justify-center mb-2 max-sm:mb-1"
      />
    </AuthLayout>
  ) : (
    <EmailSent />
  );
};
export default Otp;
