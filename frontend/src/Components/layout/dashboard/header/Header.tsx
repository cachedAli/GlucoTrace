import clsx from "clsx";

import glucoTraceDark from "/homepage/GlucoTraceDark.webp";
import { useUserStore } from "@/store/useUserStore";
import glucoTrace from "/homepage/GlucoTrace.webp";
import UserProfile from "./UserProfile";

const Header = () => {
  return (
    <header
      className={clsx(
        "sticky top-0 items-center bg-slate-50 h-20 w-full  flex md:selection:bg-indigo-800 md:selection:text-white",
        "dark:bg-gray-900"
      )}
    >
      <div className="w-full flex px-8 max-sm:px-4 items-center justify-between">
        <Logo />

        <UserProfile />
      </div>
    </header>
  );
};

const Logo = () => {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex items-center h-10">
      {user?.darkMode ? (
        <img
          src={glucoTraceDark}
          alt="GlucoTrace"
          className="max-w-[173px] w-auto mb-2"
        />
      ) : (
        <img
          src={glucoTrace}
          alt="GlucoTrace"
          className="max-h-[80px] w-auto text-blue-500"
        />
      )}
    </div>
  );
};

export default Header;
