import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { healthAdvice } from "@/libs/constants/homepage";
import { useInView } from "react-intersection-observer";

const HealthAdvice = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "10%",
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (inView) {
      const img = new Image();
      img.src = "/homepage/diabeticBG.webp";
      img.onload = () => {
        setIsImageLoaded(true);
      };
      img.onerror = () => {
        setIsImageLoaded(false);
      };
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="h-screen mx-2 rounded-bl-2xl rounded-br-2xl bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center relative"
      style={{
        backgroundImage: `url('/homepage/${
          inView && isImageLoaded ? "diabeticBG.webp" : "blurBG.png"
        }')`,
        transition: "background-image 0.5s ease-out",
      }}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-black text-white max-w-screen-2xl w-full text-center flex flex-col justify-center items-center bg-opacity-80 px-8 py-8 rounded-xl gap-4 lg:mx-40 md:mx-20 mx-8"
      >
        <h1 className="md:text-4xl text-2xl font-nunito font-semibold">
          {healthAdvice.heading}
        </h1>
        <p className=" text-sm md:text-lg md:text-justify text-center">
          {
            healthAdvice.description.split(
              "monitor your blood glucose levels regularly"
            )[0]
          }
          <span className="font-semibold">
            monitor your blood glucose levels regularly
          </span>
          {
            healthAdvice.description.split(
              "monitor your blood glucose levels regularly"
            )[1]
          }
        </p>
      </motion.div>
    </section>
  );
};

export default HealthAdvice;
