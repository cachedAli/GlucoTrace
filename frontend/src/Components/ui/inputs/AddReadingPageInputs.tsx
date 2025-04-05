import React, { useRef, useState } from "react";

import { CalendarDays, ChevronDown, ChevronUp, Clock5, X } from "lucide-react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "react-datepicker/dist/react-datepicker.css";
import {
  LocalizationProvider,
  DatePicker,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import { CommonInputProps } from "@/types/formTypes";
import { useUserStore } from "@/store/useUserStore";

export const GlucoseInput = ({
  label,
  field,
  error,
  darkMode,
}: { darkMode?: boolean } & CommonInputProps) => {
  const user = useUserStore((state) => state.user);
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";

  const maxValue = unit === "mg/dL" ? 2000 : 110;

  const styles = () => ({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value) return field.onChange("");

    const regex = unit === "mg/dL" ? /^\d*$/ : /^\d*\.?\d{0,1}$/;

    if (!regex.test(value)) return;

    const numValue = Number(value);
    if (!isNaN(numValue) && numValue <= maxValue) {
      field.onChange(numValue);
    }
  };

  return (
    <TextField
      label={label}
      {...field}
      type="number"
      variant="outlined"
      fullWidth
      onChange={handleChange}
      error={!!error}
      helperText={error}
      value={field.value || ""}
      sx={styles}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: darkMode ? "rgba(255, 255, 255, 0.7) " : "gray",
                fontWeight: "600",
                fontSize: "14px ",
              }}
            >
              {unit}
            </Typography>
          </InputAdornment>
        ),
      }}
    />
  );
};

export const MealTimingInput = ({ label, field, error }: CommonInputProps) => {
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
            value={field.value || ""}
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
            <MenuItem value="Before Meal">Before Meal</MenuItem>
            <MenuItem value="After Meal">After Meal</MenuItem>
            <MenuItem value="Fasting">Fasting</MenuItem>
            <MenuItem value="Custom">Custom</MenuItem>
          </Select>
          <FormHelperText>{error}</FormHelperText>
        </>
      )}
    </FormControl>
  );
};

export const DateInput = ({
  label,
  field,
  error,
  darkMode,
}: { darkMode?: boolean } & CommonInputProps) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        open={open}
        value={field.value || null}
        onChange={(newValue) => {
          field.onChange(newValue);
        }}
        format="DD.MM.YYYY"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        orientation="portrait"
        slots={{
          openPickerIcon: () => null,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!error,
            helperText: error,
            inputRef: anchorRef,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            InputProps: {
              startAdornment: (focused || !!field.value) && (
                <InputAdornment position="start">
                  <CalendarDays
                    color={darkMode ? "rgba(255, 255, 255, 0.7) " : "gray"}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disableRipple
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    {open ? (
                      <ChevronUp className="hover:text-indigo-800 dark:hover:text-accent transition-all" />
                    ) : (
                      <ChevronDown className="hover:text-indigo-800 dark:hover:text-accent transition-all" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          },

          popper: {
            modifiers: [
              {
                name: "flip",
                enabled: true,
              },
              {
                name: "offset",
                options: {
                  offset: [20, 0],
                },
              },
              {
                name: "preventOverflow",
                options: {
                  mainAxis: false,
                },
              },
            ],
            placement: "top",
            anchorEl: anchorRef.current,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export const TimeInput = ({
  label,
  field,
  error,
  darkMode,
}: { darkMode?: boolean } & CommonInputProps) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker
        label={label}
        value={field.value ? dayjs(field.value, "HH:mm") : null}
        onChange={(newValue) =>
          field.onChange(newValue ? newValue.format("HH:mm") : "")
        }
        format="HH:mm"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        orientation="portrait"
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!error,
            helperText: error,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),

            InputProps: {
              startAdornment: (focused || !!field.value) && (
                <InputAdornment position="start">
                  <Clock5
                    color={darkMode ? "rgba(255, 255, 255, 0.7)" : "gray"}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disableRipple
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    {open ? (
                      <ChevronUp className="hover:text-indigo-800 dark:hover:text-accent transition-all" />
                    ) : (
                      <ChevronDown className="hover:text-indigo-800 dark:hover:text-accent transition-all" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
