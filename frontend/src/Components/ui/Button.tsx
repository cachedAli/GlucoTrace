import { clsx } from "clsx";
import React from "react";

type buttonProps = {
  children: React.ReactNode;
  variant?: "fill" | "transparent";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

const Button = ({
  children,
  variant = "transparent",
  type = "button",
  disabled = false,
  className = "",
  onClick,
}: buttonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "relative overflow-hidden rounded-xl w-full h-12 group transition-all duration-300 ease-in-out",
        {
          "border-2 border-gray-300 text-blue-700 hover:border-none hover:text-white":
            variant === "transparent",
          "bg-blue-700 text-white hover:bg-opacity-95 hover:scale-[1.02]":
            variant === "fill",
          "opacity-50 cursor-not-allowed pointer-events-none": disabled,
        },
        className
      )}
    >
      {variant === "transparent" && (
        <div className="absolute bottom-0 left-0 w-full h-full bg-blue-700 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
      )}

      <span className="relative z-10 font-semibold text-lg flex items-center justify-center w-full h-full gap-2  ">
        {children}
      </span>
    </button>
  );
};

export default Button;
