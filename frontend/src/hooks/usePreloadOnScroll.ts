import { useEffect, useState } from "react";

const usePreloadOnScroll = (ref: React.RefObject<HTMLElement>, preloadCallback: () => void) => {
  const [isPreloaded, setPreloaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPreloaded) {
          preloadCallback();
          setPreloaded(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, isPreloaded, preloadCallback]);

  return isPreloaded;
};

export default usePreloadOnScroll;