import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ZodSchema } from "zod";

import { FormField } from "../../types/formTypes";
import InputField from "./InputField";
import Button from "./Button";

type FormProps = {
  fields: FormField[];
  schema: ZodSchema;
  onSubmit: (data: any) => void;
  buttonLabel?: string;
  googleAuth?: boolean;
  backButtonLabel?: string;
  resendOtp?: boolean;
  otpLength?: 4 | 6;
  disabled?: boolean;
  className?: string;
};

const Form = ({
  fields,
  schema,
  onSubmit,
  buttonLabel = "Submit",
  googleAuth = true,
  backButtonLabel,
  resendOtp = false,
  otpLength,
  disabled,
  className,
}: FormProps) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const onFormSubmit = (data: Record<string, any>) => {
    onSubmit(data);
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className=" w-full grid grid-cols-2 gap-4 items-center justify-center"
      >
        {fields.map((field, index) => (
          <React.Fragment key={index}>
            <div
              className={clsx(
                "flex flex-col",
                field.colSpan === 1 ? "col-span-1" : "col-span-2"
              )}
            >
              <InputField
                name={field.name}
                control={control}
                label={field.label}
                error={errors[field.name]?.message as string}
                type={field.type}
                isSignIn={buttonLabel === "Sign in"}
                otpLength={otpLength}
                className={className}
              />
            </div>
          </React.Fragment>
        ))}
        <FormButtons
          backButtonLabel={backButtonLabel}
          buttonLabel={buttonLabel}
          disabled={disabled}
        />
      </form>
      {resendOtp && <ResendOtp />}
      <GoogleAuthButton disabled={disabled} googleAuth={googleAuth} />
    </>
  );
};

type FormButtonProps = {
  buttonLabel: string;
  backButtonLabel?: string;
  disabled?: boolean;
};
const FormButtons = ({
  buttonLabel,
  backButtonLabel,
  disabled,
}: FormButtonProps) => {
  return (
    <>
      <Button
        variant="fill"
        type="submit"
        disabled={disabled}
        className={clsx(
          "col-span-2 !h-14 rounded-[14px]",
          "max-sm:text-base max-sm:!h-12"
        )}
      >
        {buttonLabel}
      </Button>

      {backButtonLabel && (
        <Link to="/signin" className="col-span-2">
          <Button
            variant="transparent"
            type="button"
            className={clsx(
              "!h-14 rounded-[14px]",
              "max-sm:text-base max-sm:!h-12"
            )}
          >
            {backButtonLabel}
          </Button>
        </Link>
      )}
    </>
  );
};
const GoogleAuthButton = ({
  googleAuth,
  disabled,
}: {
  googleAuth: boolean;
  disabled?: boolean;
}) => {
  return (
    <>
      {googleAuth && (
        <>
          <div className="flex items-center my-4 w-full">
            <div className="flex-grow border-t border-gray-300 h-0"></div>
            <span className="px-4 text-gray-500 text-sm whitespace-nowrap">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-300 h-0"></div>
          </div>

          <div className="w-full">
            <Button
              type="button"
              aria-label="Sign in with Google"
              disabled={disabled}
              className={clsx(
                "w-full flex items-center justify-center !h-14 rounded-[14px]",
                "max-sm:text-base max-sm:!h-12"
              )}
            >
              <FcGoogle size={20} />
              Sign in with Google
            </Button>
          </div>
        </>
      )}
    </>
  );
};

const ResendOtp = () => {
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResendOtp = () => {
    setTimeLeft(120);
    setCanResend(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={clsx(
        "flex text-center items-center justify-center w-full mt-4 -mb-2 cursor-default",
        "max-sm:text-sm"
      )}
    >
      <p className="text-gray-500 font-roboto">
        Didn't receive the code?{" "}
        {!canResend ? (
          <span className="text-blue-600">{formatTime(timeLeft)}</span>
        ) : (
          <span
            onClick={handleResendOtp}
            className="text-blue-600 cursor-pointer transition-all duration-150 hover:text-blue-800"
          >
            Resend OTP
          </span>
        )}
      </p>
    </div>
  );
};

export default Form;
