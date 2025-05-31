import clsx from "clsx";

import glucoTraceDark from "/homepage/GlucoTraceDark.webp";
import { useUserStore } from "@/store/useUserStore.js";
import glucoTrace from "/homepage/GlucoTrace.webp";
import { useLocation } from "react-router-dom";
import SearchBar from "./searchBar/SearchBar";
import UserProfile from "./UserProfile";

const Header = () => {
  const location = useLocation();
  const isHistory = location.pathname === "/dashboard/history";
  return (
    <header
      className={clsx(
        "sticky z-10 top-0 bg-white dark:bg-gray-900 h-auto w-full",
        "flex flex-col md:selection:bg-indigo-800 md:selection:text-white"
      )}
    >
      <div className="w-full flex px-8 gap-28 max-sm:px-4 items-center justify-between h-20">
        <Logo />

        {isHistory && (
          <div className="flex-1 hidden lg:flex justify-center">
            <SearchBar />
          </div>
        )}

        <UserProfile />
      </div>

      {isHistory && (
        <div className="block lg:hidden px-8 max-sm:px-4 pb-2">
          <SearchBar />
        </div>
      )}
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
          className="max-w-[173px] w-auto mb-2 max-sm:max-w-[120px]"
        />
      ) : (
        <img
          src={glucoTrace}
          alt="GlucoTrace"
          className="max-h-[80px] w-auto text-blue-500 max-sm:max-h-[52px]"
        />
      )}
    </div>
  );
};

export default Header;
