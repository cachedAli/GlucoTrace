import React from "react";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box } from "@mui/material";
import dayjs from "dayjs";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserStore } from "@/store/useUserStore";

const CustomDateRange = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useDashboardStore();
  const user = useUserStore((state) => state.user);
  const today = dayjs();
  const userCreatedAt = dayjs(user?.createdAt);
            console.log(user)

  console.log(user?.createdAt)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={2} mt={2}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newDate) => setStartDate(newDate)}
          minDate={userCreatedAt}
          maxDate={endDate || today}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newDate) => setEndDate(newDate)}
          minDate={startDate || userCreatedAt}
          maxDate={today}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CustomDateRange;
