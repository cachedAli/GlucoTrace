import Otp from "@/components/layout/userAuth/Otp";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useNavigate } from "react-router-dom";

type Data = {
  otp: string;
};

const VerifyEmail = () => {
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const VerifyEmailLoading = useDashboardStore(
    (state) => state.verifyEmailLoading
  );
  const navigate = useNavigate();

  const onSubmit = async (data: Data) => {
    try {
      const user = await verifyOtp({ otpCode: data.otp });
      if (user) navigate("/dashboard");
      console.log("Form Data:", data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Otp
        currentPage="Verify Email"
        otpLength={6}
        handleSubmit={onSubmit}
        loading={VerifyEmailLoading}
      />
    </>
  );
};

export default VerifyEmail;
