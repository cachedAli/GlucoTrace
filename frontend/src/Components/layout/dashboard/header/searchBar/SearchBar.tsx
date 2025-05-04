import React, { useState } from "react";
import clsx from "clsx";

import { Autocomplete, TextField, ThemeProvider } from "@mui/material";
import { SearchIcon } from "lucide-react";

import getInputTheme from "@/components/ui/inputs/inputTheme";
import { useReadingStore } from "@/store/useReadingStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";
import { Reading } from "@/types/userTypes";

const formatDate = (timestamp: string | number | Date) => {
  const dateObj = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const formattedDate = dateObj.toLocaleDateString(undefined, options); // Example: "May 4"
  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Example: "02:30 PM"
  return `${formattedDate} ${formattedTime}`;
};

const SearchBar = () => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const user = useUserStore((state) => state.user);
  const { readings, setFilteredReadings, resetFilteredReadings } =
    useReadingStore();
  const [isFocus, setIsFocus] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const filterOptions = (
    options: (Reading | string)[],
    { inputValue }: { inputValue: string }
  ) => {
    const searchTerm = inputValue.toLowerCase();
    return options.filter((option) => {
      if (typeof option === "string") return false;

      const date = new Date(option.timestamp).toLocaleString().toLowerCase();
      const note = option.note?.toLowerCase() || "";
      const value = option.value.toString();
      const mealTiming =
        typeof option.mealTiming === "object"
          ? option.mealTiming.custom.toLowerCase()
          : option.mealTiming.toLowerCase();

      return (
        date.includes(searchTerm) ||
        note.includes(searchTerm) ||
        value.includes(searchTerm) ||
        mealTiming.includes(searchTerm)
      );
    });
  };
  const filteredReadings = filterOptions(readings, { inputValue });

  const filterSearchedReadings = (id: number) => {
    const result = readings.filter((reading) => parseInt(reading.id) === id);
    setFilteredReadings(result);
  };

  return (
    <div className="flex-1 flex justify-center">
      <ThemeProvider theme={getInputTheme(darkMode)}>
        <Autocomplete<Reading | string, false, false, true>
          freeSolo
          options={filteredReadings}
          noOptionsText="No readings found"
          filterOptions={(options) => options}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          popupIcon={null}
          inputValue={inputValue}
          onInputChange={(_, value) => {
            setInputValue(value || "");
            if (!value) resetFilteredReadings();
          }}
          onChange={(_, value) => {
            if (value && typeof value !== "string" && "id" in value) {
              filterSearchedReadings(Number(value.id));
            }
          }}
          open={
            isFocus && (inputValue.length > 0 || filteredReadings.length === 0)
          }
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            const mealTiming =
              typeof option.mealTiming === "object"
                ? option.mealTiming.custom
                : option.mealTiming;
            const formattedDateTime = formatDate(option.timestamp);
            return `${option.value} mg/dL • ${mealTiming} • ${formattedDateTime}`;
          }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              borderRadius: "50px",
              height: 50,
              alignItems: "center",
            },
            "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.75)",
            },
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "16px",
                marginTop: "4px",
                boxShadow: "0px 20px 50px rgba(0, 0, 0, 0.25)",
              },
            },
          }}
          renderOption={(props, option, { index }) => {
            if (typeof option === "string") {
              const { key, ...restProps } = props;
              return (
                <li key={key} {...restProps}>
                  Invalid option
                </li>
              );
            }

            const { key, ...restProps } = props;
            const mealTiming =
              typeof option.mealTiming === "object"
                ? option.mealTiming.custom
                : option.mealTiming;
            const formattedDateTime = formatDate(option.timestamp);

            return (
              <li
                key={key}
                {...restProps}
                className={clsx(
                  "flex flex-col w-full px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700",
                  index !== filteredReadings.length - 1
                    ? "border-b border-gray-200 dark:border-gray-700"
                    : "pb-2"
                )}
              >
                <div className="font-medium">
                  {option.value} {user?.medicalProfile?.bloodSugarUnit} •{" "}
                  {mealTiming} • {formattedDateTime}
                </div>
                {option.note && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {option.note}
                  </div>
                )}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Readings"
              variant="outlined"
              sx={{
                "& .MuiInputBase-input": {
                  padding: "12px 14px !important",
                },
                "& .MuiAutocomplete-clearIndicator": {
                  marginRight: "4px",
                },
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: isFocus && (
                  <>
                    <SearchIcon
                      color={darkMode ? "rgba(255, 255, 255, 0.7)" : "gray"}
                      className="ml-2"
                    />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </ThemeProvider>
    </div>
  );
};

export default SearchBar;
