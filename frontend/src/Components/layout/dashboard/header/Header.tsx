import { useState } from "react";
import clsx from "clsx";

import glucoTrace from "/homepage/GlucoTrace.webp";
import UserProfile from "./UserProfile";

const Header = () => {
  return (
    <header
      className={clsx(
        "sticky top-0 items-center bg-slate-50 h-20 w-full  flex md:selection:bg-indigo-800 md:selection:text-white"
      )}
    >
      <div className="w-full flex px-8 max-sm:px-4 items-center justify-between">
        <Logo />

        <UserProfile />
      </div>
    </header>
  );
};

const Logo = () => (
  <div className="flex items-center h-10">
    <img src={glucoTrace} alt="GlucoTrace" className="max-h-[80px] w-auto" />
  </div>
);

export default Header;
