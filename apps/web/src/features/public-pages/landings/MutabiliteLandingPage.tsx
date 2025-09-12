import FaqSection from "./sections/FaqSection";
import GetNotifiedSection from "./sections/GetNotifiedSection";
import PreserveSoilsSection from "./sections/PreserveSoilsSection";
import SectionTitle from "./sections/SectionTitle";
import MutafrichesLandingHeroSection from "./sections/hero-section/MutafrichesLandingHeroSection";
import HasOnlySiteSteps from "./sections/how-it-works-section/HasOnlySiteSteps";
import HowItWorksSectionWrapper from "./sections/how-it-works-section/HowItWorksSectionWrapper";

function MutabiliteLandingPage() {
  return (
    <>
      <MutafrichesLandingHeroSection />
      <HowItWorksSectionWrapper>
        <SectionTitle>Comment ça marche ?</SectionTitle>
        <HasOnlySiteSteps />
      </HowItWorksSectionWrapper>
      <PreserveSoilsSection />
      <FaqSection />
      <GetNotifiedSection />
    </>
  );
}

export default MutabiliteLandingPage;
