import DataSourcesSection from "./sections/DataSourcesSection";
import FaqSection from "./sections/FaqSection";
import GetNotifiedSection from "./sections/GetNotifiedSection";
import HeroSection from "./sections/HeroSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import PreserveSoilsSection from "./sections/PreserveSoilsSection";
import TestimoniesSection from "./sections/TestimoniesSection";
import UrbanPlanningProfessionsSection from "./sections/UrbanPlanningProfessionsSection";
import UserLogosSection from "./sections/UsersLogosSection";
import SituationSection from "./sections/cta-section/SituationSection";

function HomePage() {
  return (
    <>
      <HeroSection />
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
