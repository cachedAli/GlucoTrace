import React from "react";
import clsx from "clsx";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { FormField } from "@/types/formTypes.js";

interface FormSkeletonProps {
  fields: FormField[];
  divider?: boolean;
  transparentButton?: boolean;
  otpLength?: 4 | 6;
}

interface OtpSkeletonProps {
  otpLength?: 4 | 6;
}

// OTP Skeleton Component
const OtpSkeleton: React.FC<OtpSkeletonProps> = ({ otpLength = 4 }) => {
  const otpWidthClass =
    otpLength === 4
      ? "w-[70px] h-[70px] max-lg:w-16 max-lg:h-16 max-sm:w-12 max-sm:h-12"
      : "w-16 h-16 max-lg:w-14 max-lg:h-14 max-sm:w-10 max-sm:h-10";
  const otpGapClass =
    otpLength === 4 ? "gap-4 max-sm:gap-2" : "gap-3 max-sm:gap-2";

  return (
    <div className={`flex justify-center ${otpGapClass}`}>
      {Array.from({ length: otpLength }).map((_, index) => (
        <div key={index} className={otpWidthClass}>
          <Skeleton
            className="w-full h-full"
            borderRadius="8px"
            baseColor="#F8FAFC"
            style={{ border: "1px solid #d1d5db" }}
          />
        </div>
      ))}
    </div>
  );
};

const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields,
  divider = false,
  transparentButton = false,
  otpLength,
}) => {
  return (
    <div className="w-full grid grid-cols-2 gap-4 items-center justify-center">
      {fields.map((field, index) => (
        <div
          key={index}
          className={clsx(
            "flex flex-col",
            field.colSpan === 1 ? "col-span-1" : "col-span-2"
          )}
        >
          {field.type === "otp" ? (
            <OtpSkeleton otpLength={otpLength || 4} />
          ) : field.type === "textarea" ? (
            <Skeleton
              height={110}
              borderRadius="14px"
              baseColor="#F8FAFC"
              style={{ border: "1px solid #d1d5db" }}
            />
          ) : (
            <Skeleton
              height={56}
              borderRadius="14px"
              baseColor="#F8FAFC"
              style={{ border: "1px solid #d1d5db" }}
            />
          )}
        </div>
      ))}
      {/* Skeleton for the submit button */}
      <div className="col-span-2 w-full">
        <Skeleton
          className="h-12 md:h-14 rounded-xl"
          baseColor="#1d4ed8"
          borderRadius="12px"
          width="100%"
        />

        {divider && (
          <div className="flex items-center my-4 w-full">
            <div className="flex-grow border-t border-gray-300 h-0"></div>
            <div className="flex-grow border-t border-gray-300 h-0"></div>
          </div>
        )}

        {transparentButton && (
          <Skeleton
            className={clsx("h-12 md:h-14 rounded-xl", !divider && "mt-4")}
            width="100%"
            borderRadius="12px"
            baseColor="#ffffff"
            style={{ border: "2px solid #D1D5DB" }}
          />
        )}
      </div>
    </div>
  );
};

export default FormSkeleton;
