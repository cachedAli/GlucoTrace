import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

import { navLinks } from "@/libs/constants/dashboard";

type MobileNavModalProps = {
  setShowNavModal: React.Dispatch<React.SetStateAction<boolean>>;
  showNavModal: boolean;
};

const MobileNavModal = ({
  setShowNavModal,
  showNavModal,
}: MobileNavModalProps) => {
  const navModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navModalRef.current &&
        e.target instanceof Node &&
        !navModalRef.current.contains(e.target)
      ) {
        setShowNavModal(false);
      }
    };

    if (showNavModal) document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNavModal]);

  return (
    <div
      ref={navModalRef}
      className={clsx(
        "absolute bottom-20 gap-1 right-8 flex-col rounded-2xl z-10 w-48 h-auto flex items-start justify-center px-2 py-2 bg-gradient-to-b from-secondary/95 to-primary shadow-xl",
        "md:hidden"
      )}
    >
      {navLinks.slice(3).map(({ to, icon, label }) => (
        <NavItems
          key={to}
          to={to}
          icon={icon}
          label={label}
          setShowNavModal={setShowNavModal}
        />
      ))}
    </div>
  );
};

type NavItemsProps = {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  setShowNavModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const NavItems = ({
  to,
  icon: Icon,
  label,
  setShowNavModal,
}: NavItemsProps) => {
  return (
    <NavLink
      to={to}
      end
      onClick={() => setShowNavModal(false)}
      className={({ isActive }) =>
        clsx(
          "flex w-full flex-row gap-4 items-center text-center group max-lg:py-2.5",
          isActive
            ? "bg-slate-50 relative transition-all duration-300 text-indigo-700 w-full py-2.5 pl-4 rounded-2xl hover:text-indigo-800 pointer-events-none"
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
export default MobileNavModal;
