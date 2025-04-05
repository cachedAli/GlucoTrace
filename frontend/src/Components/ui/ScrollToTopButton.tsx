import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = ({
  headerRef,
}: {
  headerRef: React.RefObject<HTMLElement>;
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <AnimatePresence>
        {showButton && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ translateY: -5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-6 right-6 p-4 bg-indigo-800 text-white rounded-full shadow-lg hover:bg-blue-700 "
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScrollToTopButton;
