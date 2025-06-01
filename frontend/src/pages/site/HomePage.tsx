import { useRef } from "react";

import DiabetesAdvice from "@/components_temp/layout/site/sections/adviceSection/DiabetesAdvice";
import HealthAdvice from "@/components_temp/layout/site/sections/adviceSection/HealthAdvice";
import FeatureSection from "@/components_temp/layout/site/sections/FeatureSection";
import HeroSection from "@/components_temp/layout/site/sections/HeroSection";
import ScrollToTopButton from "@/components_temp/ui/ScrollToTopButton";
import Contact from "@/components_temp/layout/site/Contact";
import Header from "@/components_temp/layout/Header";
import Footer from "@/components_temp/layout/Footer";

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
