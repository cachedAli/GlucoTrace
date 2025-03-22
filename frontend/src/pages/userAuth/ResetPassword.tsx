import { useState } from "react";
import clsx from "clsx";

import { useNavigate } from "react-router-dom";

import { resetPasswordFields } from "@/libs/constants/authPage/formFields";
import { resetPasswordSchema } from "@/libs/validations/authSchema";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";

type Data = {
  password: string;
  confirmPassword: string;
};
const ResetPassword = () => {
  const [countdown, setCountdown] = useState(5);
  const [message, setMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const submitForm = (data: Data) => {
    console.log("Reset Password Form: ", data);
    setMessage("Redirecting in ");
    setIsRedirecting(true);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      navigate("/signin");
    }, 5000);
  };

  return (
    <AuthLayout
      currentPage="Reset Password"
      formTitle="Create a New Password"
      formDescription={"Choose a new password that hasn't been used before."}
      isSignIn={false}
      resetPage={true}
    >
      <LazyLoader
        fallback={() => <FormSkeleton fields={resetPasswordFields} />}
      >
        <Form
          fields={resetPasswordFields}
          schema={resetPasswordSchema}
          onSubmit={submitForm}
          buttonLabel="Reset Password"
          googleAuth={false}
          disabled={isRedirecting}
        />
      </LazyLoader>

      <RedirectMessage countdown={countdown} message={message} />
    </AuthLayout>
  );
};

type RedirectMessageProps = {
  message: string;
  countdown: number;
};
const RedirectMessage = ({ message, countdown }: RedirectMessageProps) => {
  return (
    <>
      {message && (
        <div
          className={clsx(
            "flex text-center items-center justify-center w-full mt-4 -mb-2 cursor-default",
            "max-sm:text-sm"
          )}
        >
          {message && (
            <p className="text-gray-500">
              {message}
              <span className="text-blue-600">{countdown}</span>
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ResetPassword;
