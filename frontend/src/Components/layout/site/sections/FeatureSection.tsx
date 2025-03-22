import { useInView } from "react-intersection-observer";
import Highlighter from "react-highlight-words";

import { features, Main } from "@/libs/constants/homepage";
import { motion } from "framer-motion";

const FeatureSection = () => {
  const wordsToBold = [
    "tags",
    "Before Breakfast",
    "After Dinner",
    "charts",
    "meals",
    "insulin",
    "exercise",
    "PDF",
    "CSV",
    "doctor",
    "insights",
  ];

  const descriptionWordsToBold = [
    "struggling",
    "effective",
    "insights",
    "glucose tracker",
    " Type 1 ",
    "Type 2 diabetes",
  ];
  return (
    <main
      id="features"
      className="selection:bg-indigo-800 max-w-screen-2xl w-full mx-auto selection:text-white bg-slate-50"
    >
      <FeatureHeader descriptionWordsToBold={descriptionWordsToBold} />
      <FeatureCards wordsToBold={wordsToBold} />
    </main>
  );
};

const FeatureHeader = ({
  descriptionWordsToBold,
}: {
  descriptionWordsToBold: string[];
}) => {
  return (
    <div className="flex flex-col items-center lg:mx-44 gap-6 px-6 py-12 pt-24 text-center">
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="font-nunito text-3xl md:text-4xl font-bold bg-gradient-to-r from-headingMain to-blue-600 text-transparent bg-clip-text drop-shadow-md"
      >
        {Main.heading}
      </motion.h1>

      <p className="text-gray-800 text-base md:text-lg leading-relaxed font-medium ">
        {Main.description
          .split(/(GlucoTrace|smarter choices)/g)
          .map((part, index) =>
            part === "GlucoTrace" || part === "smarter choices" ? (
              <span key={index} className="font-semibold">
                {part}
              </span>
            ) : (
              <Highlighter
                key={index}
                highlightStyle={{ backgroundColor: "transparent" }}
                highlightClassName="text-blue-700 font-semibold"
                searchWords={descriptionWordsToBold}
                autoEscape={true}
                textToHighlight={part}
              />
            )
          )}
      </p>
    </div>
  );
};

const FeatureCards = ({ wordsToBold }: { wordsToBold: string[] }) => {
  return (
    <section className="flex flex-col gap-16 px-4 md:px-12 py-12 mx-auto max-w-6xl overflow-x-hidden">
      {features.map((feature, index) => {
        const isEven = index % 2 === 0;
        const { ref, inView } = useInView({
          triggerOnce: true,
          threshold: 0.3,
        });

        return (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            key={index}
            className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 text-center ${
              isEven ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <motion.img
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              src={inView ? feature.img : ""}
              alt=""
              className="w-64 md:w-80 h-auto rounded-xl shadow-lg max-w-full"
            />

            <div className="flex-1 flex flex-col gap-4 md:items-start items-center">
              <h1 className="font-nunito text-2xl md:text-3xl font-bold text-headingSub">
                {feature.heading}
              </h1>
              <p className=" text-base text-center md:text-start md:text-lg text-zinc-800 selection:text-white leading-relaxed">
                <Highlighter
                  highlightStyle={{ backgroundColor: "transparent" }}
                  highlightClassName="font-bold"
                  searchWords={wordsToBold}
                  autoEscape={true}
                  textToHighlight={feature.description}
                />
              </p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};

export default FeatureSection;
