import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

import { Hero } from "../../../pages/site/constants/index";
import mockup from "/MockLaptop.png";

const HeroSection = () => {
  return (
    <section className="relative mx-2 bg-[#1a237e] rounded-tl-2xl rounded-tr-2xl leading-normal lg:min-h-screen h-full pb-10 lg:pb-0 selection:bg-teal-300 selection:text-gray-900 flex items-center justify-center overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-[50%] bg-[#283593] lg:rounded-l-full flex items-center justify-center max-lg:top-0 max-lg:w-full max-lg:h-[50%] max-lg:rounded-b-full">
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
        className="whitespace-normal space-y-4 text-left md:mx-0 mx-6 md:w-1/2 max-lg:text-center"
      >
        <h1 className="font-lora md:text-5xl text-4xl font-bold mb-6">
          <span className="text-white">Easily Track Your</span>
          <br />
          <span className="text-[#7FFFD4]">Blood Sugar</span>{" "}
          <span className="text-white">Levels</span>
        </h1>
        <p className="font-roboto text-neutral-200 md:text-lg text-base leading-relaxed">
          <strong className="text-white">GlucoTrace</strong>{" "}
          {Hero.description.replace("GlucoTrace", "")}
        </p>

        <p className="font-roboto text-neutral-200 md:text-base text-sm font-light leading-relaxed">
          {Hero.value}
        </p>

        <AnimatedButton />
      </motion.section>
    </div>
  );
};

const AnimatedButton = () => {
  return (
    <button className="relative overflow-hidden border hover:border-none hover:text-gray-900 border-white text-white px-2 py-2 rounded-xl w-40 h-12 group">
      <motion.div className="absolute bottom-0 left-0 w-full h-full bg-[#7FFFD4] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-in-out" />

      <span className="relative z-10 font-semibold inline-flex items-center justify-center gap-2">
        <h2 className="text-base">Get Started</h2>
        <FaArrowRight className="text-lg" />
      </span>
    </button>
  );
};
export default HeroSection;
