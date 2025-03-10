import Otp from "@/components/layout/userAuth/Otp";

const VerifyEmail = () => {
  return (
    <>
      <Otp currentPage="Verify Email" otpLength={6} />
    </>
  );
};

export default VerifyEmail;
