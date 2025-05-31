import React from "react";
import { cn } from "@/libs/utils/utils.js";

type buttonProps = {
  children: React.ReactNode;
  variant?: "fill" | "transparent";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  hoverExpandBg?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onClick?: () => void;
};

const Button = ({
  children,
  variant = "transparent",
  type = "button",
  disabled = false,
  className = "",
  hoverExpandBg = "",
  onMouseEnter,
  onClick,
  ...props
}: buttonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={cn(
        "relative text-lg overflow-hidden rounded-xl w-full h-12 group transition-all duration-300 ease-in-out",
        {
          "border-2 border-gray-300 text-blue-700 lg:hover:border-none lg:hover:text-white dark:border-gray-600 dark:text-headingMain-dark":
            variant === "transparent",
          "bg-blue-700 text-white lg:hover:bg-opacity-95 lg:hover:scale-[1.02] ":
            variant === "fill",
          "opacity-85 cursor-not-allowed pointer-events-none": disabled,
        },
        className
      )}
      {...props}
    >
      {variant === "transparent" && (
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full h-full bg-blue-700 origin-left scale-x-0 lg:group-hover:scale-x-100 transition-transform duration-300 ease-in-out",
            hoverExpandBg
          )}
        />
      )}

      <span className="relative font-semibold flex items-center justify-center w-full h-full gap-2  ">
        {children}
      </span>
    </button>
  );
};

export default Button;
