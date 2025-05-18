import { useState } from "react";
import clsx from "clsx";

import { Controller, Control, ControllerRenderProps } from "react-hook-form";
import { MantineProvider, PinInput } from "@mantine/core";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Eye, EyeClosed, X } from "lucide-react";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

import { DateInput, GlucoseInput, TimeInput } from "./AddReadingPageInputs";
import { BaseProps, CommonInputProps } from "@/types/formTypes";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface InputProps extends BaseProps {
  control: Control<any>;
  name: string;
  isSignIn?: boolean;
  otpLength?: 4 | 6;
  className?: string;
  darkMode?: boolean;
}

const InputField = ({
  label,
  type = "text",
  control,
  name,
  error,
  isSignIn,
  otpLength = 4,
  className,
  darkMode,
  options,
  enableCustom,
  customLabel,
  maxCustomLength,
  useDefault,
  defaultValue,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={clsx("flex flex-col", className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const commonProps = { label, field, error };
          switch (type) {
            case "textarea":
              return <TextAreaInput {...commonProps} />;
            case "password":
              return (
                <PasswordInput
                  {...commonProps}
                  {...{ isSignIn, showPassword, setShowPassword }}
                />
              );
            case "number":
              return <NumberInput {...commonProps} />;
            case "otp":
              return <OtpInput {...{ field, error, otpLength }} />;

            case "glucose":
              return (
                <GlucoseInput {...{ ...commonProps }} darkMode={darkMode} />
              );

            case "select":
              return (
                <BaseSelectInput
                  {...{ ...commonProps }}
                  {...{
                    customLabel,
                    enableCustom,
                    maxCustomLength,
                    options,
                    useDefault,
                    defaultValue,
                  }}
                />
              );

            case "date":
              return <DateInput {...{ ...commonProps }} darkMode={darkMode} />;

            case "time":
              return <TimeInput {...{ ...commonProps }} darkMode={darkMode} />;

            default:
              return <BaseInput {...commonProps} type={type} />;
          }
        }}
      />
    </div>
  );
};

const BaseInput = ({
  label,
  field,
  error,
  type,
}: CommonInputProps & { type: string }) => (
  <TextField
    label={label}
    {...field}
    type={type}
    variant="outlined"
    fullWidth
    error={!!error}
    helperText={error}
    value={field.value || ""}
  />
);

const TextAreaInput = ({ label, field, error }: CommonInputProps) => (
  <TextField
    label={label}
    {...field}
    multiline
    rows={4}
    variant="outlined"
    fullWidth
    error={!!error}
    helperText={error}
    value={field.value || ""}
  />
);

const PasswordInput = ({
  label,
  field,
  showPassword,
  error,
  isSignIn,
  setShowPassword,
}: CommonInputProps & {
  showPassword: boolean;
  isSignIn?: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  return (
    <div>
      <TextField
        label={label}
        {...field}
        type={showPassword ? "text" : "password"}
        variant="outlined"
        fullWidth
        error={!!error}
        helperText={error}
        value={field.value || ""}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton disableRipple onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeClosed
                    size={20}
                    className="hover:text-blue-500 text-gray-400"
                  />
                ) : (
                  <Eye
                    size={20}
                    className="hover:text-blue-500 text-gray-400"
                  />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          onCopy: (e) => e.preventDefault(),
          onCut: (e) => e.preventDefault(),
          onPaste: (e) => e.preventDefault(),
        }}
      />
      {isSignIn && (
        <Link to="/forgot-password" className="flex justify-end mt-1">
          <p className="text-zinc-400 hover:text-blue-500 cursor-pointer transition-all max-sm:text-sm">
            Forgot Password?
          </p>
        </Link>
      )}
    </div>
  );
};

const OtpInput = ({
  field,
  error,
  otpLength,
}: {
  field: ControllerRenderProps<any, string>;
  error?: string;
  otpLength?: 4 | 6;
}) => {
  const otpWidth =
    otpLength === 4
      ? "w-[70px] h-[70px] max-lg:w-16 max-lg:h-16 max-sm:w-12 max-sm:h-12"
      : "w-16 h-16 max-lg:w-14 max-lg:h-14 max-sm:w-10 max-sm:h-10";
  const otpGap = otpLength === 4 ? "gap-4 max-sm:gap-2" : "gap-3 max-sm:gap-2";

  return (
    <MantineProvider>
      <div className="flex flex-col gap-2 items-center justify-center">
        <PinInput
          length={otpLength}
          type="number"
          placeholder=""
          value={field.value || ""}
          onChange={(value) => field.onChange(value)}
          classNames={{
            root: `flex justify-center w-full ${otpGap}`,
            input: `${otpWidth} transition-all text-xl text-center border focus:border-2 rounded-lg outline-none ${
              error
                ? "border-red-500 focus:border-red-500 focus:bg-red-50"
                : "border-gray-300 hover:border-blue-600 focus:border-blue-600 focus:bg-blue-50"
            }`,
          }}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </MantineProvider>
  );
};

export default InputField;

interface BaseSelectProps extends BaseProps {
  field: ControllerRenderProps<any, string>;
}

export const BaseSelectInput = ({
  label,
  options,
  field,
  error,
  enableCustom = false,
  customLabel = "Custom",
  useDefault = false,
  defaultValue = "",
}: BaseSelectProps) => {
  const [customMeal, setCustomMeal] = useState("");
  const [remountKey, setRemountKey] = useState(0);
  const [isCustom, setIsCustom] = useState(false);

  const handleChange = (e: SelectChangeEvent) => {
    const value = e.target.value;
    if (value === "Custom") {
      setIsCustom(true);
      field.onChange({ custom: "" });
      setRemountKey((prev) => prev + 1);
    } else {
      setIsCustom(false);
      setRemountKey((prev) => prev + 1);

      field.onChange(value);
    }
    setCustomMeal("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomMeal(value);
    field.onChange({ custom: value });
  };

  const handleCloseCustom = () => {
    setCustomMeal("");
    field.onChange(undefined);
    setRemountKey((prev) => prev + 1);
    setIsCustom(false);
  };

  return (
    <FormControl error={!!error} fullWidth key={remountKey}>
      {typeof field.value === "object" && isCustom ? (
        <TextField
          label="Custom Meal Timing"
          variant="outlined"
          fullWidth
          onChange={handleCustomChange}
          error={!!error || customMeal.length > 25}
          helperText={
            error || (customMeal.length > 25 && "Maximum 25 characters")
          }
          value={customMeal}
          autoFocus
          required
          InputLabelProps={{
            required: true,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <X
                  onClick={handleCloseCustom}
                  className="cursor-pointer hover:text-indigo-800 dark:hover:text-accent transition-all"
                />
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            value={
              typeof field.value === "object"
                ? ""
                : field.value || (useDefault ? defaultValue : "")
            }
            error={!!error}
            label={label}
            variant="outlined"
            onChange={handleChange}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "16px",
                  marginTop: "4px",
                },
              },
            }}
          >
            {options?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
            {enableCustom && (
              <MenuItem value={customLabel}>{customLabel}</MenuItem>
            )}
          </Select>
          <FormHelperText>{error}</FormHelperText>
        </>
      )}
    </FormControl>
  );
};

const NumberInput = ({ label, field, error }: CommonInputProps) => {
  const min = 1;
  const max = 110;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseInt(e.target.value);
    field.onChange(isNaN(value as number) ? "" : value);
  };

  const currentValue =
    field.value !== undefined && field.value !== null ? field.value : "";

  return (
    <TextField
      label={label}
      type="number"
      variant="outlined"
      fullWidth
      error={!!error}
      helperText={error}
      value={currentValue}
      inputProps={{
        min,
        max,
        inputMode: "numeric",
        pattern: "[0-9]*",
        style: { MozAppearance: "textfield" }, // Firefox
      }}
      onChange={handleChange}
      sx={{
        "& input[type=number]::-webkit-outer-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
      }}
    />
  );
};
