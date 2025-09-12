import DataSourcesSection from "./sections/DataSourcesSection";
import FaqSection from "./sections/FaqSection";
import GetNotifiedSection from "./sections/GetNotifiedSection";
import PreserveSoilsSection from "./sections/PreserveSoilsSection";
import SectionTitle from "./sections/SectionTitle";
import TestimoniesSection from "./sections/TestimoniesSection";
import UrbanPlanningProfessionsSection from "./sections/UrbanPlanningProfessionsSection";
import UserLogosSection from "./sections/UsersLogosSection";
import BenefrichesLandingHeroSection from "./sections/hero-section/BenefrichesLandingHeroSection";
import HasSiteAndProjectSteps from "./sections/how-it-works-section/HasSiteAndProjectSteps";
import HowItWorksSectionWrapper from "./sections/how-it-works-section/HowItWorksSectionWrapper";

function BenefrichesLandingPage() {
  return (
    <>
      <BenefrichesLandingHeroSection />
      <HowItWorksSectionWrapper mode="white">
        <SectionTitle>Comment ça marche ?</SectionTitle>

        <HasSiteAndProjectSteps />
      </HowItWorksSectionWrapper>
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

export default BenefrichesLandingPage;
