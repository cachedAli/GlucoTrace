import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import clsx from "clsx";

import MobileNavModal from "./sidebar/MobileNavModal";
import { useThemeStore } from "@/store/useThemeStore";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";

const DashboardLayout = () => {
  const applyDarkMode = useThemeStore((state) => state.applyDarkMode);
  const [showNavModal, setShowNavModal] = useState(false);

  useEffect(() => {
    applyDarkMode;
  }, []);

  const handleNavModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNavModal((prev) => !prev);
  };

  return (
    <div className={clsx("font-inter min-h-screen flex flex-col")}>
      <Header />
      <div
        className={clsx("flex flex-1 mx-12 pt-2", "max-lg:mx-6", "max-sm:mx-4")}
      >
        <Sidebar handleNavModal={handleNavModal} />
        <div className={clsx("flex-1 px-12 ml-20", "max-lg:ml-0 max-lg:px-0")}>
          <Outlet />
        </div>
      </div>

      {showNavModal && (
        <MobileNavModal
          setShowNavModal={setShowNavModal}
          showNavModal={showNavModal}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
