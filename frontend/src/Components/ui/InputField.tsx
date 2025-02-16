import React, { useState } from "react";
import clsx from "clsx";

import { Controller, Control, ControllerRenderProps } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Eye, EyeClosed } from "lucide-react";

type InputProps = {
  label: string;
  type?: "text" | "email" | "password" | "textarea";
  control: Control<any>;
  name: string;
  error?: string;
};

const InputField = ({
  label,
  type = "text",
  control,
  name,
  error,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className={clsx("flex flex-col")}>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === "textarea" ? (
            <TextAreaInput label={label} field={field} error={error} />
          ) : type === "password" ? (
            <>
              <PasswordAreaInput
                label={label}
                field={field}
                error={error}
                showPassword={showPassword}
                handleTogglePassword={handleTogglePassword}
              />
            </>
          ) : (
            <TextField
              label={label}
              {...field}
              type={type}
              variant="outlined"
              fullWidth
              error={!!error}
              helperText={error}
              value={field.value || ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  height: "56px",
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                },
              }}
            />
          )
        }
      />
    </div>
  );
};

type TextAreaProps = {
  label: string;
  field: ControllerRenderProps<any, string>;
  error?: string;
};

const TextAreaInput = ({ label, field, error }: TextAreaProps) => (
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
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "14px",
        "& fieldset": {
          borderColor: "#d1d5db",
        },
      },
    }}
  />
);

type PasswordAreaProps = {
  label: string;
  field: ControllerRenderProps<any, string>;
  showPassword: boolean;
  error?: string;
  handleTogglePassword: () => void;
};

const PasswordAreaInput = ({
  label,
  field,
  showPassword,
  error,
  handleTogglePassword,
}: PasswordAreaProps) => (
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
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          height: "56px",
          "& fieldset": {
            borderColor: "#d1d5db",
          },
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton disableRipple onClick={handleTogglePassword}>
              {showPassword ? (
                <EyeClosed
                  size={20}
                  className="hover:text-blue-500 text-gray-400"
                />
              ) : (
                <Eye size={20} className="hover:text-blue-500 text-gray-400" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    <div className="flex justify-end mt-1">
      <p className=" text-zinc-400 hover:text-blue-500 cursor-pointer transition-all">
        Forgot Password?
      </p>
    </div>
  </div>
);

export default InputField;
