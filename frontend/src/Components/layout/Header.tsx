import { useState } from "react";
import clsx from "clsx";

import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

import glucoTrace from "/homepage/GlucoTrace.webp";
import { preloadForm } from "@/router/preloadRoutes.js";

type HeaderProps = {
  headerRef?: React.RefObject<HTMLElement>;
  authPage?: boolean;
  isSignInPage?: boolean;
  resetPage?: boolean;
};

const Header = ({
  headerRef,
  authPage = false,
  isSignInPage = false,
  resetPage = false,
}: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      ref={headerRef}
      className="bg-transparent max-w-screen-2xl mx-auto w-full h-[88px] flex md:selection:bg-indigo-800 md:selection:text-white"
    >
      <div className="w-full flex px-8 max-sm:px-4 items-center justify-between">
        <MobileMenuButton
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          authPage={authPage}
        />

        <LogoLink authPage={authPage} />

        <DesktopNavigation authPage={authPage} />

        <AuthSection
          authPage={authPage}
          isSignInPage={isSignInPage}
          resetPage={resetPage}
        />
      </div>
    </header>
  );
};

type MobileMenuProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  authPage?: boolean;
};

const MobileMenuButton = ({
  menuOpen,
  setMenuOpen,
  authPage,
}: MobileMenuProps) => {
  if (authPage) return null;

  return (
    <div className="md:hidden flex order-1">
      <button onClick={() => setMenuOpen(!menuOpen)}>
        <Menu className="text-blue-700 text-2xl cursor-pointer" />
      </button>
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  );
};

const MobileMenu = ({ menuOpen, setMenuOpen }: MobileMenuProps) => (
  <div
    className={`${
      menuOpen ? "translate-x-0" : "translate-x-full"
    } fixed top-0 right-0 w-72 bg-blue-200 h-full transition-transform duration-300 ease-in-out z-50 md:hidden`}
  >
    <button
      className="absolute top-4 right-4 text-2xl text-white cursor-pointer"
      onClick={() => setMenuOpen(false)}
    >
      <X className="text-blue-800 text-3xl" />
    </button>

    <nav className="p-6 mt-4">
      <ul className="flex flex-col items-start text-slate-700 text-lg font-semibold space-y-6">
        <NavItem to="/" label="Home" />
        <NavItem href="#features" label="Features" />
        <NavItem href="#contact" label="Contact" />
      </ul>
    </nav>
  </div>
);

type NavItemProps = {
  to?: string;
  href?: string;
  label: string;
};

const NavItem = ({ to, href, label }: NavItemProps) => (
  <li className="relative group cursor-pointer">
    <span className="relative inline-block">
      {to ? <Link to={to}>{label}</Link> : <a href={href}>{label}</a>}
      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-800 scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300" />
    </span>
  </li>
);

type LogoLinkProps = {
  authPage?: boolean;
};

const LogoLink = ({ authPage }: LogoLinkProps) => (
  <Link
    to="/"
    className={clsx(
      "order-2 md:order-1",
      authPage ? "mr-auto" : "mx-auto md:mx-0",
      "transition-all duration-300"
    )}
  >
    <img src={glucoTrace} alt="GlucoTrace" className="max-h-[80px] w-auto" />
  </Link>
);

type DesktopNavigationProps = {
  authPage?: boolean;
};

const DesktopNavigation = ({ authPage }: DesktopNavigationProps) => (
  <div className="order-3 md:order-2">
    {!authPage && (
      <nav className="hidden md:flex md:space-x-12 space-y-6 md:space-y-0 md:relative md:flex-row flex-col md:items-center md:text-gray-700 text-slate-700 text-lg p-6 font-semibold">
        <ul className="flex space-x-12">
          <NavItem to="/" label="Home" />
          <NavItem href="#features" label="Features" />
          <NavItem href="#contact" label="Contact" />
        </ul>
      </nav>
    )}
  </div>
);

type AuthSectionProps = {
  authPage?: boolean;
  isSignInPage?: boolean;
  resetPage?: boolean;
};

const AuthSection = ({
  authPage,
  isSignInPage,
  resetPage,
}: AuthSectionProps) => (
  <div className="order-4 md:order-3">
    {authPage ? (
      <AuthPageButtons isSignInPage={isSignInPage} resetPage={resetPage} />
    ) : (
      <Link
        to="/signin"
        onMouseEnter={preloadForm}
        className="text-indigo-500 font-nunito tracking-wide hover:opacity-85 hover:transition-all hover:duration-300 text-lg max-sm:text-sm font-bold p-1"
      >
        Sign In
      </Link>
    )}
  </div>
);

type AuthPageButtonsProps = {
  isSignInPage?: boolean;
  resetPage?: boolean;
};

const AuthPageButtons = ({ isSignInPage, resetPage }: AuthPageButtonsProps) => {
  if (resetPage) {
    return (
      <Link
        to="/signin"
        className="text-indigo-500 font-nunito tracking-wide hover:opacity-85 hover:transition-all hover:duration-300 text-lg max-sm:text-sm font-bold p-1"
      >
        Sign In
      </Link>
    );
  }

  return isSignInPage ? <SignUpPrompt /> : <SignInPrompt />;
};

const SignInPrompt = () => (
  <div
    className={clsx(
      "flex items-center gap-2 text-lg w-full",
      "max-sm:gap-0 max-sm:text-center"
    )}
  >
    <p
      className={clsx(
        "text-gray-600 block",
        "max-sm:text-xs whitespace-nowrap"
      )}
    >
      Already have an account?
    </p>
    <Link
      to="/signin"
      className={clsx(
        "text-indigo-500 text-center tracking-wide hover:opacity-85 hover:transition-all hover:duration-300 text-lg font-nunito  font-bold p-1",
        " max-sm:text-xs"
      )}
    >
      Sign In
    </Link>
  </div>
);

const SignUpPrompt = () => (
  <div
    className={clsx(
      "flex items-center gap- text-lg",
      "max-sm:gap-0 max-sm:text-center"
    )}
  >
    <p
      className={clsx(
        "text-gray-600 block",
        "max-sm:text-xs whitespace-nowrap"
      )}
    >
      Don't have an account?
    </p>
    <Link
      to="/signup"
      className="text-indigo-500 tracking-wide hover:opacity-85 hover:transition-all hover:duration-300 text-lg max-sm:text-xs font-nunito font-bold p-1"
    >
      Sign Up
    </Link>
  </div>
);

export default Header;
