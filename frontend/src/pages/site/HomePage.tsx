import { useRef } from "react";

import DiabetesAdvice from "@/components/layout/site/sections/adviceSection/DiabetesAdvice";
import HealthAdvice from "@/components/layout/site/sections/adviceSection/HealthAdvice";
import FeatureSection from "@/components/layout/site/sections/FeatureSection";
import HeroSection from "@/components/layout/site/sections/HeroSection";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import Contact from "@/components/layout/site/Contact";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const HomePage = () => {
  const headerRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <Header headerRef={headerRef} />
      <HeroSection />
      <HealthAdvice />
      <FeatureSection />
      <DiabetesAdvice />
      <Contact />
      <Footer />
      <ScrollToTopButton headerRef={headerRef} />
    </>
  );
};

export default HomePage;
