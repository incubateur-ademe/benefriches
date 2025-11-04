import { MUTAFRICHES_HIGHLIGHTS } from "@/features/public-pages/highlightContent";
import HighlightsList from "@/shared/views/components/HighlightsList/HighlightsList";

import MutafrichesButton from "../cta-section/AccessMutafrichesButton";
import HeroSection from "./HeroSection";
import { HERO_CTA_BUTTON_CLASSNAMES } from "./buttonClassNames";

export default function MutafrichesLandingHeroSection() {
  return (
    <HeroSection
      className="bg-[#52238C]"
      title="Identifiez l’usage le plus adapté pour votre friche."
      imgSrc="/img/mutabilite-hero.svg"
    >
      <HighlightsList items={MUTAFRICHES_HIGHLIGHTS} />

      <MutafrichesButton className={HERO_CTA_BUTTON_CLASSNAMES} />
    </HeroSection>
  );
}
