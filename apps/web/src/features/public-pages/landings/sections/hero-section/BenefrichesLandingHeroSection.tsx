import { BENEFRICHES_HIGHLIGHTS } from "@/features/public-pages/highlightContent";
import HighlightsList from "@/shared/views/components/HighlightsList/HighlightsList";

import BenefrichesButton from "../cta-section/AccessBenefrichesButton";
import HeroSection from "./HeroSection";
import { HERO_CTA_BUTTON_CLASSNAMES } from "./buttonClassNames";

export default function BenefrichesLandingHeroSection() {
  return (
    <HeroSection
      className="bg-[#007EAF]"
      title="Calculez les impacts socio-économiques de votre projet d'aménagement."
      imgSrc="/img/homepage-hero.svg"
    >
      <HighlightsList items={BENEFRICHES_HIGHLIGHTS} />
      <BenefrichesButton className={HERO_CTA_BUTTON_CLASSNAMES} />
    </HeroSection>
  );
}
