import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThemeProvider } from "@emotion/react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ZodSchema } from "zod";
import dayjs from "dayjs";

import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import InputField from "../inputs/InputField";
import { FormField } from "@/types/formTypes";
import inputTheme from "../inputs/inputTheme";
import BaseLoader from "../loader/BaseLoader";
import Button from "./Button";

type FormProps = {
  fields: FormField[];
  schema: ZodSchema;
  onSubmit: (data: any) => Promise<any>;
  resendOtpOnSubmit?: () => Promise<boolean>;
  buttonLabel?: string;
  googleAuth?: boolean;
  backButtonLabel?: string;
  resendOtp?: boolean;
  disabled?: boolean;
  otpLength?: 4 | 6;
  loading?: boolean;
  className?: string;
  buttonClassName?: string;
  buttonAlignment?: "center" | "end";
  isSignIn?: boolean;
};
const Form = ({
  fields,
  schema,
  onSubmit,
  buttonLabel = "Submit",
  googleAuth = true,
  backButtonLabel,
  resendOtp = false,
  disabled = false,
  otpLength,
  loading,
  className,
  buttonClassName,
  buttonAlignment = "center",
  isSignIn = false,
  resendOtpOnSubmit,
}: FormProps) => {
  const user = useUserStore((state) => state.user);
  const darkMode = useThemeStore((state) => state.darkMode);
  const theme = useMemo(() => inputTheme(darkMode), [darkMode]);
  const originalUnit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  useFormDefaults({ fields, user, reset, originalUnit });

  const onFormSubmit = async (data: Record<string, any>) => {
    const submittedUnit = data.unit;
    let finalTargetMin = data.targetMin;
    let finalTargetMax = data.targetMax;

    // Always use displayed values but convert if unit changed
    if (submittedUnit !== originalUnit) {
      const convertValue = (value: number) => {
        if (originalUnit === "mg/dL" && submittedUnit === "mmol/L")
          return +(value / 18).toFixed(1);
        if (originalUnit === "mmol/L" && submittedUnit === "mg/dL")
          return Math.round(value * 18);
        return value;
      };

      finalTargetMin = convertValue(Number(data.targetMin));
      finalTargetMax = convertValue(Number(data.targetMax));
    }

    finalTargetMin = Number(finalTargetMin);
    finalTargetMax = Number(finalTargetMax);

    const shouldReset = await onSubmit({
      ...data,
      targetMin: finalTargetMin,
      targetMax: finalTargetMax,
    });
    if (shouldReset) {
      reset();
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="w-full grid grid-cols-2 gap-4 items-center justify-center"
      >
        {fields.map((field, index) => (
          <div
            key={index}
            className={clsx(
              "flex flex-col",
              field.colSpan === 1 ? "col-span-1" : "col-span-2",
              field.smColSpan && "max-sm:col-span-2"
            )}
          >
            <ThemeProvider theme={theme}>
              <InputField
                name={field.name}
                control={control}
                label={field.label}
                error={errors[field.name]?.message as string}
                type={field.type}
                otpLength={otpLength}
                className={className}
                isSignIn={isSignIn}
                darkMode={darkMode}
                {...(field.type === "select" && {
                  options: field.options,
                  defaultValue: field.defaultValue,
                })}
              />
            </ThemeProvider>
          </div>
        ))}
        <div
          className={clsx(
            "col-span-2 flex gap-4 w-full",
            buttonAlignment === "end"
              ? "justify-end"
              : "justify-center flex-col"
          )}
        >
          <FormButtons
            backButtonLabel={backButtonLabel}
            buttonLabel={buttonLabel}
            loading={loading}
            buttonClassName={buttonClassName}
            disabled={disabled}
          />
        </div>
      </form>
      {resendOtp && <ResendOtp resendOtpOnSubmit={resendOtpOnSubmit} />}
      <GoogleAuthButton googleAuth={googleAuth} />
    </>
  );
};

type UseFormDefaultsProps = {
  fields: FormField[];
  user: any;
  reset: (values: Record<string, any>) => void;
  originalUnit: "mg/dL" | "mmol/L";
};

const useFormDefaults = ({
  fields,
  user,
  reset,
  originalUnit,
}: UseFormDefaultsProps) => {
  useEffect(() => {
    const defaults = fields.reduce((acc, field) => {
      switch (field.name) {
        case "age":
          acc[field.name] = user?.medicalProfile?.age;
          break;
        case "gender":
          acc[field.name] = user?.medicalProfile?.gender;
          break;
        case "diabetesType":
          acc[field.name] = user?.medicalProfile?.diabetesType;
          break;
        case "diagnosisDate": {
          const storedDate = user?.medicalProfile?.diagnosisDate;
          acc[field.name] = storedDate ? dayjs(storedDate) : null;
          break;
        }
        case "unit":
          acc[field.name] = originalUnit;
          break;
        case "targetMin":
        case "targetMax": {
          const isMmol = originalUnit === "mmol/L";
          const value =
            user?.medicalProfile?.targetBloodSugarRange?.[
              field.name === "targetMin" ? "min" : "max"
            ] ??
            (field.name === "targetMin"
              ? isMmol
                ? 3.9
                : 70
              : isMmol
              ? 10
              : 180);
          acc[field.name] = value;

          break;
        }
        default:
          acc[field.name] = field.defaultValue ?? "";
      }
      return acc;
    }, {} as Record<string, any>);

    reset(defaults);
  }, [user?.medicalProfile, originalUnit, fields, reset]);
};

type FormButtonProps = {
  buttonLabel: string;
  backButtonLabel?: string;
  buttonClassName?: string;
  loading?: boolean;
  disabled?: boolean;
};
const FormButtons = ({
  buttonLabel,
  backButtonLabel,
  loading,
  buttonClassName,
  disabled,
}: FormButtonProps) => {
  return (
    <>
      <Button
        variant="fill"
        type="submit"
        disabled={loading || disabled}
        className={clsx(
          "col-span-2 !h-14 rounded-[14px]",
          "max-sm:text-base max-sm:!h-12",
          buttonClassName
        )}
      >
        {loading ? <BaseLoader /> : buttonLabel}
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
const GoogleAuthButton = ({ googleAuth }: { googleAuth: boolean }) => {
  const { signInWithGoogle, googleLoading } = useAuthStore();

  const onSubmit = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };
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
              onClick={onSubmit}
              disabled={googleLoading ? true : false}
              className={clsx(
                "w-full flex items-center justify-center !h-14 rounded-[14px]",
                "max-sm:text-base max-sm:!h-12"
              )}
            >
              {googleLoading ? (
                <>
                  <BaseLoader color="blue" />
                </>
              ) : (
                <>
                  <FcGoogle size={20} />
                  Sign in with Google
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

const OTP_TIMEOUT_SECONDS = 120;
const RESEND_TIMESTAMP_KEY = "otp-last-sent-at";

const ResendOtp = ({
  resendOtpOnSubmit,
}: {
  resendOtpOnSubmit?: () => Promise<boolean>;
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    const lastSent = localStorage.getItem(RESEND_TIMESTAMP_KEY);
    if (lastSent) {
      const secondsSince = Math.floor((Date.now() - Number(lastSent)) / 1000);
      const remaining = OTP_TIMEOUT_SECONDS - secondsSince;
      if (remaining > 0) {
        setTimeLeft(remaining);
        setCanResend(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!canResend && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, canResend]);

  const handleResendOtp = async () => {
    if (resendOtpOnSubmit) {
      const success = await resendOtpOnSubmit();

      if (success) {
        localStorage.setItem(RESEND_TIMESTAMP_KEY, Date.now().toString());
        setTimeLeft(OTP_TIMEOUT_SECONDS);
        setCanResend(false);
      } else {
        setCanResend(true);
      }
    }
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
      <p className="text-gray-500">
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
