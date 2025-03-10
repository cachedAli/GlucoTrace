import { motion } from "framer-motion";

import { complications } from "@/libs/constants/homepage";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const DiabetesAdvice = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "10%",
  });

  useEffect(() => {
    if (inView) {
      const img = new Image();
      img.src = "/homepage/diabeticBG2.webp";
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
      className="h-screen mx-2 rounded-tl-2xl rounded-tr-2xl bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
      style={{
        backgroundImage: `url('/homepage/${
          inView && isImageLoaded ? "diabeticBG2.webp" : "blurBG2.png"
        }')`,
        transition: "background-image 0.5s ease-out",
        backgroundColor: "#f0f0f0",
      }}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-black text-white max-w-screen-2xl w-full text-center flex flex-col justify-center items-center bg-opacity-80 px-8 py-8  rounded-xl gap-4 lg:mx-40 md:mx-20 mx-8"
      >
        <h1 className="md:text-4xl text-2xl font-lora font-semibold">
          {complications.heading}
        </h1>
        <p className="font-roboto text-sm md:text-lg md:text-justify text-center ">
          {
            complications.description.split(
              "American Diabetes Association (ADA)"
            )[0]
          }
          <a
            href="https://www.diabetes.org/diabetes/type-2/symptoms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            American Diabetes Association (ADA)
          </a>
          {
            complications.description.split(
              "American Diabetes Association (ADA)"
            )[1]
          }
        </p>
      </motion.div>
    </section>
  );
};

export default DiabetesAdvice;
