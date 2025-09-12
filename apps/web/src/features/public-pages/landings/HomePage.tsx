import DataSourcesSection from "./sections/DataSourcesSection";
import FaqSection from "./sections/FaqSection";
import GetNotifiedSection from "./sections/GetNotifiedSection";
import PreserveSoilsSection from "./sections/PreserveSoilsSection";
import TestimoniesSection from "./sections/TestimoniesSection";
import UrbanPlanningProfessionsSection from "./sections/UrbanPlanningProfessionsSection";
import UserLogosSection from "./sections/UsersLogosSection";
import SituationSection from "./sections/cta-section/SituationSection";
import HeroHomeSection from "./sections/hero-section/HomeHeroSection";
import HowItWorksSection from "./sections/how-it-works-section/HomeHowItWorksSection";

function HomePage() {
  return (
    <>
      <HeroHomeSection />
      <HowItWorksSection />
      <SituationSection />
      <UserLogosSection />
      <UrbanPlanningProfessionsSection />
      <DataSourcesSection />
      <TestimoniesSection />
      <PreserveSoilsSection />
      <FaqSection />
      <GetNotifiedSection />
    </>
  );
}

export default HomePage;
