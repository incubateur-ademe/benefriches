import DataSourcesSection from "./sections/new/DataSourcesSection";
import FaqSection from "./sections/new/FaqSection";
import GetNotifiedSection from "./sections/new/GetNotifiedSection";
import HeroSection from "./sections/new/HeroSection";
import HowItWorksSection from "./sections/new/HowItWorksSection";
import PreserveSoilsSection from "./sections/new/PreserveSoilsSection";
import SituationSection from "./sections/new/SituationSection";
import TestimoniesSection from "./sections/new/TestimoniesSection";
import UrbanPlanningProfessionsSection from "./sections/new/UrbanPlanningProfessionsSection";
import UserLogosSection from "./sections/new/UsersLogosSection";

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
