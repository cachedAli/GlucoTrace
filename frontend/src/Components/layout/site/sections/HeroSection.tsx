import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { preloadForm } from "@/router/preloadRoutes";
import { Hero } from "@/libs/constants/homepage";
import mockup from "/homepage/MockLaptop.png";

const HeroSection = () => {
  return (
    <section className="relative mx-2 bg-primary rounded-tl-2xl rounded-tr-2xl leading-normal lg:min-h-screen h-full pb-10 lg:pb-0 selection:bg-teal-300 selection:text-gray-900 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center">
        <div className="absolute right-0 top-0 h-full w-[50%] bg-secondary lg:rounded-l-full flex items-center justify-center max-lg:top-0 max-lg:w-full max-lg:h-[50%] max-lg:rounded-b-full">
          <motion.img
            src={mockup}
            alt="Laptop Mockup"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-[80%] max-w-[450px] lg:mb-14 "
          />
        </div>
        <HeroTextSection />
      </div>
    </section>
  );
};

const HeroTextSection = () => {
  return (
    <div className="relative flex items-center lg:flex-row flex-col lg:mx-36 gap-6 w-full max-lg:mt-[550px] max-md:mt-[440px]">
      <motion.section
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="whitespace-normal font-nunito space-y-4 text-left md:mx-0 mx-6 md:w-1/2 max-lg:text-center"
      >
        <h1 className="md:text-5xl text-4xl font-bold mb-6">
          <span className="text-white">Easily Track Your</span>
          <br />
          <span className="text-accent">Blood Sugar</span>{" "}
          <span className="text-white">Levels</span>
        </h1>
        <p className=" text-neutral-200 font-inter md:text-lg text-base leading-relaxed">
          <strong className="text-white">GlucoTrace</strong>{" "}
          {Hero.description.replace("GlucoTrace", "")}
        </p>

        <p className=" text-neutral-200 font-inter md:text-base text-sm font-light leading-relaxed">
          {Hero.value}
        </p>

        <AnimatedButton />
      </motion.section>
    </div>
  );
};

const AnimatedButton = () => {
  return (
    <button className="relative overflow-hidden font-semibold inline-flex items-center justify-center gap-2 border hover:border-none hover:text-gray-900 border-white text-white rounded-xl w-40 h-12 group">
      <motion.div className="absolute bottom-0 left-0 w-full h-full bg-accent origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-in-out" />

      <Link
        to="/signup"
        onMouseEnter={preloadForm}
        className="relative font-nunito px-2 py-2 w-full h-full z-10 font-bold inline-flex items-center justify-center gap-2"
      >
        <h2 className="text-base">Get Started</h2>
        <ArrowRight className="text-lg mt-1" />
      </Link>
    </button>
  );
};
export default HeroSection;
