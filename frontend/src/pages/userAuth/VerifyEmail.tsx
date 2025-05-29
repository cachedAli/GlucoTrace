import { supabase } from "@/libs/supabaseClient";
import { useNavigate } from "react-router-dom";

import Otp from "@/components/layout/userAuth/Otp";
import { useAuthStore } from "@/store/useAuthStore";

type Data = {
  otp: string;
};

const VerifyEmail = () => {
  const { verifyOtp, verifyEmailLoading, resendVerifyOtp } = useAuthStore();

  const handleResend = async () => {
    const { data } = await supabase.auth.getUser();
    const email = data?.user?.email || "";
    const success = await resendVerifyOtp({ email });

    if (success) {
      return true;
    } else {
      return false;
    }
  };

  const navigate = useNavigate();

  const onSubmit = async (data: Data) => {
    try {
      const user = await verifyOtp({ otpCode: data.otp });
      if (user) {
        navigate("/dashboard");
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
      <Otp
        currentPage="Verify Email"
        otpLength={6}
        handleSubmit={onSubmit}
        resendOtp={handleResend}
        loading={verifyEmailLoading}
      />
    </>
  );
};

export default VerifyEmail;
