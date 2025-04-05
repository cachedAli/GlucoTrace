import { useEffect } from "react";
import clsx from "clsx";

import { Outlet } from "react-router-dom";

import { useThemeStore } from "@/store/useThemeStore";
import DashboardOverlay from "./DashboardOverlay";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";

const DashboardLayout = () => {
  const applyDarkMode = useThemeStore((state) => state.applyDarkMode);

  useEffect(() => {
    if (!document.documentElement.classList.contains("dark")) {
      applyDarkMode();
    }
  }, [applyDarkMode]);

  return (
    <div className={clsx("font-inter min-h-screen flex flex-col ")}>
      <Header />
      <div
        className={clsx("flex flex-1 mx-12 pt-2", "max-lg:mx-6", "max-sm:mx-4")}
      >
        <Sidebar />
        <div
          className={clsx(
            "flex-1 px-12 ml-20 flex flex-col gap-3 mb-6",
            "max-lg:ml-0 max-lg:px-0",
            "max-sm:mb-32"
          )}
        >
          <Outlet />
        </div>
      </div>

      <DashboardOverlay />
    </div>
  );
};

export default DashboardLayout;
