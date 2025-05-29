import { useEffect, useRef } from "react";
import clsx from "clsx";
import { Outlet } from "react-router-dom";

import { useThemeStore } from "@/store/useThemeStore";
import DashboardOverlay from "./DashboardOverlay";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useUserStore } from "@/store/useUserStore";
import { useReadingStore } from "@/store/useReadingStore";
import { StatsProvider } from "@/providers/StatsProvider";

const DashboardLayout = () => {
  const applyDarkMode = useThemeStore((state) => state.applyDarkMode);
  const fetchUser = useUserStore((state) => state.fetchUserFromSupabase);
  const { fetchReadings } = useReadingStore();
  const user = useUserStore((state) => state.user);
  const hasAppliedDarkMode = useRef(false);

  useScrollToTop();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  useEffect(() => {
    if (user && !hasAppliedDarkMode.current) {
      applyDarkMode();
      hasAppliedDarkMode.current = true;
    }
  }, [user, applyDarkMode]);

  return (
    <StatsProvider>
      <div className={clsx("font-inter min-h-screen flex flex-col")}>
        <Header />
        <div
          className={clsx(
            "flex flex-1 mx-12 pt-2",
            "max-lg:mx-6",
            "max-sm:mx-4"
          )}
        >
          <Sidebar />
          <div
            className={clsx(
              "flex-1 px-12 ml-20 flex flex-col gap-3 mb-6",
              "max-lg:ml-0 max-lg:px-0 max-lg:mb-28"
            )}
          >
            <Outlet />
          </div>
        </div>
        <DashboardOverlay />
      </div>
    </StatsProvider>
  );
};

export default DashboardLayout;
