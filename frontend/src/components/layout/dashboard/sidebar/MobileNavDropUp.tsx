import React, { useRef } from "react";
import clsx from "clsx";

import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useCloseOnClick } from "@/hooks/useCloseOnClick";
import { navLinks } from "@/libs/constants/dashboard";

const MobileNavDropUp = () => {
  const { setShowNavModal, showNavModal } = useDashboardStore();
  const navModalRef = useRef<HTMLDivElement>(null);

  useCloseOnClick(navModalRef, showNavModal, setShowNavModal);

  return (
    <motion.div
      ref={navModalRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.15,
        type: "spring",
        stiffness: 250,
        damping: 18,
      }}
      className={clsx(
        "fixed bottom-20 gap-1 right-8 flex-col rounded-2xl z-30 w-48 h-auto flex items-start justify-center px-2 py-2 bg-gradient-to-b from-secondary/95 to-primary shadow-xl",
        "sm:hidden",
        "dark:bg-gradient-to-b dark:from-blue-700 dark:from-[0] dark:to-indigo-700"
      )}
    >
      {navLinks.slice(3).map(({ to, icon, label }) => (
        <NavItems key={to} to={to} icon={icon} label={label} />
      ))}
    </motion.div>
  );
};

type NavItemsProps = {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};
const NavItems = ({ to, icon: Icon, label }: NavItemsProps) => {
  const { setShowNavModal, setShowLogoutModal } = useDashboardStore();

  return (
    <NavLink
      to={label === "Logout" ? "#" : to}
      end
      onClick={() => {
        setShowNavModal(false);
        label === "Logout" ? setShowLogoutModal(true) : undefined;
      }}
      className={({ isActive }) =>
        clsx(
          "flex w-full flex-row gap-4 items-center text-center group max-lg:py-2.5",
          isActive && label !== "Logout"
            ? "bg-slate-50 relative transition-all duration-300 text-indigo-700 w-full py-2.5 pl-4 rounded-2xl hover:text-indigo-800 pointer-events-none dark:bg-gray-900 dark:text-accent/90"
            : "text-white before:scale-100 before:opacity-0 after:scale-100 after:opacity-0"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="size-5 max-[375px]:size-4" />

          <span
            className={clsx(
              " text-[10px] text-center block",
              isActive
                ? "font-semibold lg:block"
                : "font-medium lg:hidden max-[375px]:text-[8px]"
            )}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};
export default MobileNavDropUp;
