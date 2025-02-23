import { OTP } from "@/components/router/LazyRoutes";

const VerifyEmail = () => {
  return (
    <>
      <OTP currentPage="Verify Email" otpLength={6} />
    </>
  );
};

export default VerifyEmail;
