import { useState } from "react";

import { OtpField } from "@/libs/constants/authPage/formFields";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import { OtpSchema } from "@/libs/validations/authSchema";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";
import EmailSent from "./EmailSent";
import { supabase } from "@/libs/supabaseClient";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";

type OtpProps = {
  otpLength: 4 | 6;
  currentPage: string;
  loading?: boolean;
  handleSubmit: (data: any) => Promise<void>;
};

const Otp = ({
  otpLength = 4,
  currentPage = "Forgot Password",
  loading,
  handleSubmit,
}: OtpProps) => {
  const [step, setStep] = useState<"otp" | "emailSentMessage">("otp");
  const resendVerifyOtp = useAuthStore((state) => state.resendVerifyOtp);

  if (otpLength === 4) {
    setStep("emailSentMessage");
  }

  const handleResend = async (): Promise<boolean> => {
    const resendPromise = (async () => {
      const { data, error } = await supabase.auth.getUser();
      const email = data?.user?.email || "";

      if (error || !email) {
        throw new Error(error?.message || "Email not found");
      }

      const success = await resendVerifyOtp({ email });

      if (!success) {
        throw new Error("Failed to resend verification email");
      }

      return true;
    })();

    try {
      await toast.promise(resendPromise, {
        loading: "Resending OTP...",
        success: "OTP sent!",
        error: (err) => err.message || "Failed to resend OTP",
      });

      return true;
    } catch {
      return false;
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
      <LazyLoader
        fallback={() => (
          <FormSkeleton fields={OtpField} otpLength={otpLength} />
        )}
      >
        <Form
          resendOtp
          fields={OtpField}
          onSubmit={handleSubmit}
          resendOtpOnSubmit={handleResend}
          schema={OtpSchema(otpLength)}
          buttonLabel="Confirm Code"
          googleAuth={false}
          loading={loading}
          otpLength={otpLength}
          className="!flex-row items-center justify-center mb-2 max-sm:mb-1"
        />
      </LazyLoader>
    </AuthLayout>
  ) : (
    <EmailSent />
  );
};
export default Otp;
