import BenefrichesButton from "../cta-section/BenefrichesButton";
import BenefrichesHighlights from "../cta-section/BenefrichesHighlights";
import HeroSection from "./HeroSection";
import { HERO_CTA_BUTTON_CLASSNAMES } from "./buttonClassNames";

export default function BenefrichesLandingHeroSection() {
  return (
    <HeroSection
      className="bg-[#007EAF]"
      title="Calculez les impacts socio-économiques de votre projet d'aménagement."
      imgSrc="/img/homepage-hero.svg"
    >
      <>
        <BenefrichesHighlights />
        <BenefrichesButton className={HERO_CTA_BUTTON_CLASSNAMES} />
      </>
    </HeroSection>
  );
}
