import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/libs/supabaseClient";

import Otp from "@/components_temp/layout/userAuth/Otp";
import { useAuthStore } from "@/store/useAuthStore";
import {
  preloadDashboardLayout,
  preloadOverview,
} from "@/router/preloadRoutes";

type Data = {
  otp: string;
};

const VerifyEmail = () => {
  const { verifyOtp, verifyEmailLoading, resendVerifyOtp } = useAuthStore();
  const hasPrefetched = useRef(false);
  const navigate = useNavigate();

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

  const onSubmit = async (data: Data) => {
    try {
      const user = await verifyOtp({ otpCode: data.otp });
      if (user) {
        preloadDashboardLayout();
        preloadOverview();
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

  const handleMouseEnter = () => {
    if (!hasPrefetched.current) {
      preloadDashboardLayout();
      preloadOverview();
      hasPrefetched.current = true;
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
        onMouseEnter={handleMouseEnter}
      />
    </>
  );
};

export default VerifyEmail;
