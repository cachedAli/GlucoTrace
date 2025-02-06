import { motion } from "framer-motion";
import { features, Main } from "../../../pages/site/constants";
import Highlighter from "react-highlight-words";

const FeatureSection = () => {
  const wordsToBold = [
    "tags",
    "charts",
    "meals",
    "insulin",
    "exercise",
    "PDF",
    "CSV",
    "doctor",
    "healthcare provider",
    "insights",
    "different times of the day",
  ];
  return (
    <main
      id="features"
      className=" selection:bg-indigo-800 selection:text-white"
    >
      <div className="flex flex-col items-center lg:mx-44 gap-4 px-4 py-4 pt-20">
        <motion.h1
          initial={{ scale: 0.5 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="font-lora text-center md:text-4xl text-3xl font-bold text-[#193798]"
        >
          {Main.heading}
        </motion.h1>
      </div>
      <FeatureCards wordsToBold={wordsToBold} />
    </main>
  );
};

const FeatureCards = ({ wordsToBold }) => {
  return (
    <section className="flex flex-col gap-6 md:flex-row md:px-12 py-12 mx-auto flex-wrap">
      {features.map((feature, index) => (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 1 }}
          key={index}
          className="flex bg-white shadow-md flex-col items-center  md:items-start text-center md:text-left rounded-xl p-6 max-sm:p-2 mx-auto"
        >
          <img
            src={feature.img}
            alt=""
            loading="lazy"
            className={`w-80 rounded-xl mb-6 ${index === 0 ? "h-[236px]" : ""}`}
          />
          <div className="w-80">
            <h1 className="font-lora text-3xl font-bold text-[#1A389C] mb-4">
              {feature.heading}
            </h1>
            <p className="font-roboto text-base md:text-lg text-zinc-800 selection:text-white">
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
      ))}
    </section>
  );
};

export default FeatureSection;
