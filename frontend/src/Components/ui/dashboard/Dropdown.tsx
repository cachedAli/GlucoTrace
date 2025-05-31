import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { motion } from "framer-motion";

import { useCloseOnClick } from "@/hooks/useCloseOnClick.js";
import { capitalizeFirstLetter } from "@/libs/utils/utils.js";
import { Check } from "lucide-react";

interface SubMenuItem {
  label: string;
  onClick?: () => void;
}

interface DropdownItem {
  label: string;
  onClick?: () => void;
  subMenu?: SubMenuItem[];
  icon?: JSX.Element;
}

interface DropdownProps {
  items: DropdownItem[];
  direction?: "left" | "right";
  value: boolean;
  setValue: (value: boolean) => void;
  ref: React.RefObject<HTMLElement>;
  selectedItem?: string;
  onSelect?: (label: string) => void;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ items, direction, value, setValue, selectedItem, onSelect }, ref) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(
      null
    );
    const [activeSubMenuIndex, setActiveSubMenuIndex] = useState<number | null>(
      null
    );
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkScreen = () => setIsMobile(window.innerWidth <= 640);
      checkScreen();
      window.addEventListener("resize", checkScreen);
      return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useCloseOnClick(ref as React.RefObject<HTMLElement>, value, setValue);

    const handleMouseEnter = (index: number) => {
      if (delayTimeout) clearTimeout(delayTimeout);
      if (!isMobile) setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
      const timeout = setTimeout(() => {
        if (!isMobile) {
          setHoveredIndex(null);
        }
      }, 200);
      setDelayTimeout(timeout);
    };

    const handleItemClick = (item: DropdownItem) => {
      item.onClick?.();
      onSelect?.(item?.label);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.15,
          type: "spring",
          stiffness: 250,
          damping: 18,
        }}
        className={clsx(
          "bg-white dark:bg-stone-900 dark:text-white",
          "px-2 py-2 z-30 w-48 h-auto absolute top-[52px]",
          "rounded-2xl border border-gray-200 dark:border-gray-900",
          "shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
        )}
      >
        <ul className="w-full flex flex-col items-start justify-start gap-1">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={(e) => {
                if (!item.subMenu) {
                  handleItemClick(item);
                } else if (isMobile) {
                  e.stopPropagation();
                  setActiveSubMenuIndex(
                    activeSubMenuIndex === index ? null : index
                  );
                }
              }}
              className={clsx(
                "relative group cursor-pointer",
                "hover:bg-neutral-100 dark:hover:bg-neutral-700",
                "w-full px-2 py-1.5 hover:rounded-lg transition-all",
                index !== items.length - 1 &&
                  "border-b border-gray-200 dark:border-gray-700"
              )}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {capitalizeFirstLetter(item.label)} {item?.icon}
                </span>
                {selectedItem === item.label && (
                  <Check
                    size={20}
                    className="text-blue-700 dark:text-blue-500/90"
                  />
                )}
              </div>
              <SubMenu
                subMenu={item.subMenu}
                isVisible={
                  isMobile
                    ? activeSubMenuIndex === index
                    : hoveredIndex === index
                }
                direction={direction}
                onSelect={onSelect}
                selectedItem={selectedItem}
              />
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }
);

export default Dropdown;

const SubMenu = ({
  subMenu,
  isVisible,
  direction,
  selectedItem,
  onSelect,
}: {
  subMenu?: SubMenuItem[];
  isVisible: boolean;
  direction?: "left" | "right";
  selectedItem?: string;
  onSelect?: (label: string) => void;
}) => {
  if (!subMenu) return null;

  return (
    <ul
      className={clsx(
        "absolute right-full z-50 top-0 mr-4 w-40 bg-white dark:bg-stone-800",
        "border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg",
        "transition-opacity duration-200",
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
        direction === "left"
          ? "max-sm:left-full max-sm:ml-2"
          : "max-sm:right-full max-sm:mr-2"
      )}
    >
      {subMenu.map((subItem, subIndex) => (
        <li
          key={subIndex}
          onClick={() => {
            subItem.onClick?.(), onSelect?.(subItem.label);
          }}
          className={clsx(
            "cursor-pointer",
            "hover:bg-neutral-100 dark:hover:bg-neutral-700",
            "w-full px-3 py-1.5  transition-all",
            subIndex !== subMenu.length - 1 &&
              "border-b border-gray-200 dark:border-gray-700",
            subIndex === 0
              ? "hover:rounded-tr-xl hover:rounded-tl-xl"
              : subIndex === subMenu.length - 1
              ? "hover:rounded-br-xl hover:rounded-bl-xl"
              : ""
          )}
        >
          <span className="flex items-center justify-between">
            {capitalizeFirstLetter(subItem.label)}
            {selectedItem === subItem.label && (
              <Check
                size={20}
                className="text-blue-700 dark:text-blue-500/90"
              />
            )}
          </span>
        </li>
      ))}
    </ul>
  );
};
