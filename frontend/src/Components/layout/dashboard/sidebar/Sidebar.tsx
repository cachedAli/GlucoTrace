import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { navLinks } from "@/libs/constants/dashboard";
import { NavLink } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

const Sidebar = ({
  handleNavModal,
}: {
  handleNavModal: (e: React.MouseEvent) => void;
}) => {
  return (
    <aside
      className={clsx(
        "bg-gradient-to-b from-secondary/90 from-[60%] to-primary",
        "fixed h-[calc(100vh-88px-4px)] w-20 rounded-3xl flex items-center flex-col py-8 mb-1",
        "max-lg:fixed max-lg:bottom-1 max-lg:left-0 max-lg:right-0 max-lg:bg-gradient-to-r max-lg:from-secondary max-lg:to-primary max-lg:w-[calc(100%-3rem)] max-lg:h-auto max-lg:flex-row max-lg:rounded-3xl max-lg:py-3 max-lg:mx-6",
        "max-sm:max-sm:w-[calc(100%-2rem)] max-sm:mx-4"
      )}
    >
      <NavLinks handleNavModal={handleNavModal} />
    </aside>
  );
};

const NavLinks = ({
  handleNavModal,
}: {
  handleNavModal: (e: React.MouseEvent) => void;
}) => {
  return (
    <nav
      className={clsx(
        "text-white flex flex-col items-center justify-between h-full w-full",
        "max-lg:flex-row max-lg:justify-center"
      )}
    >
      <DesktopNav />
      <MobileNav handleNavModal={handleNavModal} />
    </nav>
  );
};

const DesktopNav = () => {
  return (
    <>
      <div
        className={clsx(
          "flex flex-col gap-10 h-full",
          "max-2xl:gap-6",
          "max-lg:hidden"
        )}
      >
        {navLinks.slice(0, 6).map(({ to, icon, label }) => (
          <NavItems key={to} to={to} icon={icon} label={label} />
        ))}
      </div>

      <div
        className={clsx(
          "flex flex-col items-center gap-10",
          "max-2xl:gap-6",
          "max-lg:hidden"
        )}
      >
        {navLinks.slice(6, 8).map(({ to, icon, label }) => (
          <NavItems key={to} to={to} icon={icon} label={label} />
        ))}
      </div>
    </>
  );
};

const MobileNav = ({
  handleNavModal,
}: {
  handleNavModal: (e: React.MouseEvent) => void;
}) => {
  return (
    <>
      <div
        className={clsx(
          "hidden flex-col h-full",
          "max-lg:flex-row max-lg:flex",
          "max-sm:px-4 max-sm:whitespace-nowrap"
        )}
      >
        <div
          className={clsx(
            "flex gap-[47px] min-w-max",
            "max-md:gap-[30px]",
            "max-sm:hidden"
          )}
        >
          {navLinks.map(({ to, icon, label }) => (
            <NavItems key={to} to={to} icon={icon} label={label} />
          ))}
        </div>

        <div
          className={clsx(
            "hidden min-w-max gap-[34px] items-center",
            "max-sm:flex",
            "max-[375px]:gap-[25px]"
          )}
        >
          {navLinks.slice(0, 3).map(({ to, icon, label }) => (
            <NavItems key={to} to={to} icon={icon} label={label} />
          ))}
          <MoreHorizontal
            onClick={handleNavModal}
            className={clsx("size-5 cursor-pointer", "max-[375px]:size-4")}
          />
        </div>
      </div>
    </>
  );
};

type NavItemsProps = {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};
const NavItems = ({ to, icon: Icon, label }: NavItemsProps) => {
  const bottomLinks = ["Settings", "Logout"].includes(label);

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        clsx("flex flex-col items-center group", {
          // Base styles
          "text-white before:scale-100 before:opacity-0 after:scale-100 after:opacity-0 max-lg:py-2.5":
            !isActive,
          // Hover
          "lg:hover:text-accent": bottomLinks,
          "lg:hover:text-teal-300 ": !bottomLinks,

          // Active
          "bg-slate-50 relative transition-all duration-300 text-indigo-700 w-20 py-2.5 ml-2 pr-2 rounded-l-full hover:text-indigo-800 pointer-events-none max-lg:rounded-2xl max-lg:pr-0 max-lg:ml-0 max-[375px]:w-[70px]":
            isActive,
          // Before::
          "before:bg-transparent before:z-10 before:w-8 before:h-8 before:absolute before:rounded-full before:shadow-[15px_15px_0_theme(colors.slate.50)] before:-top-8 before:right-1 before:opacity-100 before:transition-all before:duration-300 max-lg:before:hidden":
            isActive,
          // After::
          "after:bg-transparent after:z-10 after:w-8 after:h-8 after:absolute after:rounded-full after:shadow-[15px_-15px_0_theme(colors.slate.50)] after:-bottom-8 after:right-1 after:opacity-100 after:transition-all after:duration-300 max-lg:after:hidden":
            isActive,
        })
      }
    >
      {({ isActive }) => (
        <>
          {/* Icon */}
          <Icon className={clsx("size-5", "max-[375px]:size-4")} />

          {/* Label */}
          <span
            className={clsx(
              "mt-[6px] text-[9px] text-center block",
              bottomLinks || isActive ? "lg:block" : "lg:hidden",
              isActive ? "font-semibold" : "font-normal",
              "max-[375px]:text-[8px]"
            )}
          >
            {label}
          </span>

          {/* Tooltip */}
          {!bottomLinks && !isActive && (
            <span
              className={clsx(
                "absolute z-10 left-[90px] bg-secondary text-accent px-2 py-1 rounded-lg text-xs pointer-events-none  invisible -translate-x-3 opacity-20 transition-all whitespace-nowrap",
                "group-hover:visible group-hover:translate-x-0 group-hover:opacity-100",
                "max-lg:hidden"
              )}
            >
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};
export default Sidebar;
