import Button from "@codegouvfr/react-dsfr/Button";

import HeroSection from "./HeroSection";
import { HERO_CTA_BUTTON_CLASSNAMES } from "./buttonClassNames";

export default function HeroHomeSection() {
  return (
    <HeroSection
      className="bg-[#007EAF]"
      title="Calculez les impacts socio-économiques de votre projet d'aménagement."
      imgSrc="/img/homepage-hero.svg"
    >
      <>
        <p className="text-sm mb-8">+ de 400 projets évalués</p>
        <Button
          linkProps={{ href: "#votre-projet-d-amenagement" }}
          size="large"
          className={HERO_CTA_BUTTON_CLASSNAMES}
        >
          Commencer
        </Button>
      </>
    </HeroSection>
  );
}
