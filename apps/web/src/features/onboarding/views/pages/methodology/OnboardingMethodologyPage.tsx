import OnboardingStepShell from "../step-shell/OnboardingStepShell";
import type { OnboardingVariant } from "../step-shell/onboardingVariant";

// Best-effort copy: the real Figma copy (file tgMAVc4oAfXQ3a8NRURmcF, node 28571:5857) was not
// reachable from this environment. These strings need design confirmation before shipping.
const HEADING = "Une méthodologie éprouvée";
const ADEME_PARAGRAPH = "Bénéfriches est un outil développé par l'ADEME depuis 2023.";
const TESTED_PARAGRAPH =
  "Il a été testé avec plus de 150 personnes (collectivités, DDT, EPF, développeurs photovoltaïques, etc.).";

type Props = {
  variant?: OnboardingVariant;
};

export default function OnboardingMethodologyPage({ variant }: Props) {
  return (
    <OnboardingStepShell
      step="methodology"
      variant={variant}
      htmlTitle={`${HEADING} - Premiers pas`}
    >
      <h2 className="mb-4">{HEADING}</h2>
      <p className="mb-4">{ADEME_PARAGRAPH}</p>
      <p className="mb-4">{TESTED_PARAGRAPH}</p>
      <p className="mb-0">
        Il prend en compte un large éventail de données (finances de la collectivité, emploi,
        qualité de vie des riverains, environnement, etc.), et se base sur des sources documentées
        dans{" "}
        {/* TODO: link to the real methodology page/anchor once it exists (tracked separately) */}
        <a className="fr-link">cette notice</a>.
      </p>
    </OnboardingStepShell>
  );
}
