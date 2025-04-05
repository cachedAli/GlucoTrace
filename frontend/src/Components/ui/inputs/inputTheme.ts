
import { createTheme } from "@mui/material";

const getInputTheme = (darkMode: boolean) => {


  return createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          fullWidth: true,
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "14px",
            "& fieldset": {
              borderColor: darkMode ? "rgba(255, 255, 255, 255) !important" : "#d1d5db !important",
            },
            "&:hover fieldset": {
              borderColor: "#2563eb !important",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb !important",
            },
            "&.Mui-error fieldset": {
              borderColor: darkMode ? "#f04e4e !important" : "#d32f2f !important",
            },
            "&.MuiOutlinedInput-notchedOutline": {
              borderRadius: "16px",
            },
            "&:not(.MuiInputBase-multiline)": {
              height: "56px",
            },
            "& .MuiInputBase-input": {
              fontFamily: "Inter, sans-serif",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: darkMode ? "rgba(255, 255, 255, 0.7) !important" : "",
            "&.Mui-focused": {
              color: !darkMode ? "#2563eb !important" : "#3b82f6 !important",
            },
            "&.Mui-error": {
              color: darkMode ? "#f04e4e !important" : "#d32f2f !important",
            },
          },
        },
      },

      // Mobile Calender
      MuiDialog: {
        styleOverrides: {
          root: {
            "& .MuiDialog-paper": {
              borderRadius: "16px !important",
            },
            "& .MuiPickersCalendarHeader-label": {
              fontWeight: "600 !important",
              fontFamily: "Montserrat, sans-serif !important",
              fontSize: "20px !important",
            },
            "& .MuiDayCalendar-weekDayLabel": {
              fontWeight: "700 !important",
              fontFamily: "Montserrat, sans-serif !important",
              color: `${darkMode ? "rgba(255, 255, 255, 0.7)" : "#2e2d2d"} !important`,
            },
            "& .MuiPickersDay-today": {
              border: "0px !important",
              color: darkMode ? "#5195ff" : "#3b82f6 !important",
              backgroundColor: `${darkMode ? "rgba(59, 130, 246, 0.3)" : "#eef5ff"} !important`,
              fontWeight: "bold !important",
            },

            "&  .MuiPickersDay-root.Mui-selected": {
              backgroundColor: "#3b82f6 !important",
              color: "#fff !important",
              fontWeight: "600 !important",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1) !important",
            },

            // Clock
            "& .MuiClockPointer-root": {
              backgroundColor: "#3b82f6 !important",
              "&::after": {
                content: '""',
                width: "8px",
                height: "8px",
                backgroundColor: "#3b82f6",
                borderRadius: "50%",
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              },
            },
            '& .MuiClockPointer-thumb': {
              backgroundColor: '#3b82f6 !important',
              borderColor: '#2563eb',
            },
            '& .MuiClock-squareMask': {
              backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
            },
            "& .MuiClockNumber-root.Mui-selected": {
              color: darkMode ? "#4effcd" : "#ffffff",
              fontWeight: darkMode ? "600" : "500",
            },

            "& .MuiDialogActions-root": {
              padding: "16px",
              justifyContent: "flex-end",

              "& .MuiButton-root": {
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                color: darkMode ? "#3b82f6" : "#2563eb",

                "&:hover": {
                  backgroundColor: darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.1)",
                },

                "&.MuiButton-textPrimary": {
                  color: darkMode ? "#3b82f6" : "#2563eb",
                },
                "&.MuiButton-textSecondary": {
                  color: darkMode ? "#f87171" : "#d32f2f",
                },
              },
            },


          }
        }
      },


      // Desktop Calender
      MuiPaper: {
        styleOverrides: {
          root: {
            "&.MuiPickersPopper-paper": {
              borderRadius: "16px !important",
              marginTop: "4px !important",
              "& .MuiPickersCalendarHeader-label": {
                fontWeight: "600",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "20px",
              },

              "& .MuiDayCalendar-weekDayLabel": {
                fontWeight: "700 !important",
                fontFamily: "Montserrat, sans-serif !important",
                color: `${darkMode ? "rgba(255, 255, 255, 0.7)" : "#2e2d2d"} !important`,
              },
              "& .MuiPickersDay-today": {
                border: "0px !important",
                color: darkMode ? "#5195ff" : "#3b82f6 !important",
                backgroundColor: `${darkMode ? "rgba(59, 130, 246, 0.3)" : "#eef5ff"} !important`,
                fontWeight: "bold !important",
              },
              "& .MuiPickersDay-today:hover": {
                color: darkMode && "#5195ff !important"
              },
              "&  .MuiPickersDay-root.Mui-selected": {
                backgroundColor: "#3b82f6 !important",
                color: "#fff !important",
                fontWeight: "600 !important",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1) !important",
                "&:hover": {
                  backgroundColor: "#2563eb !important",
                },
              },
              "& .MuiPickersDay-root:hover": {
                backgroundColor: darkMode ? "#b0c9ff" : "#eef5ff",
                color: darkMode && "#1b1b1b"
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&:hover": { borderColor: "#3b82f6" },
              },
            },

          },
        },
      },


    },
  });
};
export default getInputTheme;
