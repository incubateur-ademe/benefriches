import MutafrichesButton from "../cta-section/MutafrichesButton";
import MutafrichesHighlights from "../cta-section/MutafrichesHighlights";
import HeroSection from "./HeroSection";
import { HERO_CTA_BUTTON_CLASSNAMES } from "./buttonClassNames";

export default function MutafrichesLandingHeroSection() {
  return (
    <HeroSection
      className="bg-[#52238C]"
      title="Identifiez l’usage le plus adapté pour votre friche."
      imgSrc="/img/mutabilite-hero.svg"
    >
      <MutafrichesHighlights />

      <MutafrichesButton className={HERO_CTA_BUTTON_CLASSNAMES} />
    </HeroSection>
  );
}
