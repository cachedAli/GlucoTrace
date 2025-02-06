import { useState } from "react";

import { FaBarsStaggered } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

import { Link } from "react-router-dom";

import glucoTrace from "/GlucoTrace.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header
      className={`bg-transparent h-[88px] flex font-roboto md:selection:bg-indigo-800  md:selection:text-white`}
    >
      <div className="w-full flex px-8 max-sm:px-4 items-center justify-between">
        <img
          src={glucoTrace}
          alt="GlucoTrace"
          className="w-56 order-2 md::order-1"
        />

        <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <DeskTopNav />
        <button className="order-3 text-indigo-900 hover:opacity-80 hover:transition-all hover:duration-300 rounded-sm text-base max-sm:text-sm font-medium p-1 ">
          Sign Up
        </button>
      </div>
    </header>
  );
};

const DeskTopNav = () => {
  return (
    <nav className="hidden md:order-2 md:flex md:space-x-12 space-y-6 md:space-y-0 md:relative md:flex-row flex-col md:items-center md:text-gray-700 text-slate-700 text-lg p-6 font-medium">
      <ul className="flex space-x-12">
        <li className="relative group cursor-pointer">
          <span className="before:scale-x-0 group-hover:opacity-90 before:absolute before:top-8 md:before:bg-indigo-700 before:bg-indigo-800 before:h-[2px] before:content-[''] group-hover:before:scale-x-100 before:w-full before:origin-center before:transition-transform before:duration-300">
            <Link to="/">Home</Link>
          </span>
        </li>
        <li className="relative group cursor-pointer">
          <span className="before:scale-x-0 before:absolute before:top-8 md:before:bg-indigo-700 before:bg-indigo-800 group-hover:opacity-90 before:h-[2px] before:content-[''] group-hover:before:scale-x-100 before:w-full before:origin-center before:transition-transform before:duration-300">
            <a href="#features">Features</a>
          </span>
        </li>
        <li className="relative group cursor-pointer">
          <span className="before:scale-x-0 group-hover:opacity-90 before:absolute before:top-8 md:before:bg-indigo-700 before:bg-indigo-800 before:h-[2px] before:content-[''] group-hover:before:scale-x-100 before:w-full before:origin-center before:transition-transform before:duration-300">
            <a href="#contact">Contact</a>
          </span>
        </li>
      </ul>
    </nav>
  );
};

const MobileNav = ({ setMenuOpen, menuOpen }) => {
  return (
    <>
      <div className="md:hidden order-1" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBarsStaggered className="text-blue-700 text-2xl cursor-pointer" />
      </div>

      <div
        className={`${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 w-72 bg-blue-200 h-full transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        {/* Close Button */}
        <div
          className="absolute top-4 right-4 text-2xl text-white cursor-pointer"
          onClick={() => setMenuOpen(false)}
        >
          <IoCloseSharp className="text-blue-800 text-3xl" />
        </div>

        <ul className="flex flex-col items-start text-slate-700 text-lg font-medium p-6 space-y-6 mt-4">
          <li className="relative group cursor-pointer">
            <span className="relative inline-block">
              <Link to="/">Home</Link>
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-800 scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
            </span>
          </li>
          <li className="relative group cursor-pointer">
            <span className="relative inline-block">
              <a href="#features">Features</a>
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-800 scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
            </span>
          </li>
          <li className="relative group cursor-pointer">
            <span className="relative inline-block">
              <a href="#contact">Contact</a>
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-800 scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
