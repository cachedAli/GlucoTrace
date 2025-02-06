import DiabetesAdvice from "../../layout/site/sections/adviceSection/DiabetesAdvice";
import HealthAdvice from "../../layout/site/sections/adviceSection/HealthAdvice";
import FeatureSection from "../../layout/site/sections/FeatureSection";
import HeroSection from "../../layout/site/sections/HeroSection";
import Contact from "../../layout/site/Contact";
import Header from "../../Header";
import Footer from "../../layout/site/Footer";

const HomePage = () => {
  return (
    <div className="max-w-screen-2xl w-full flex flex-col mx-auto ">
      <Header />
      <HeroSection />
      <HealthAdvice />
      <FeatureSection />
      <DiabetesAdvice />
      <Contact />
      <Footer />
    </div>
  );
};


export default HomePage;
