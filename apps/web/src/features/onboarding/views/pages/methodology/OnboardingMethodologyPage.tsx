import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

import OnboardingStepShell from "../step-shell/OnboardingStepShell";
import type { OnboardingVariant } from "../step-shell/onboardingVariant";

const HEADING = "Avant de commencer, petit point méthodo.";
const FAQ_DIALOG_ID = "fr-dialog-about-impacts-header";

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
      <h2 className={classNames(fr.cx("fr-text--lg", "fr-text--bold"), "mb-4")}>{HEADING}</h2>
      <p className="mb-4">
        Il est important de rappeler que Bénéfriches est le seul outil qui permette de calculer les
        impacts socio-économiques et environnementaux d'un projet d'aménagement.
      </p>
      <p className="mb-4">
        L'outil est développé par l'ADEME depuis 2023, il a été testé auprès de plus de 150
        personnes (collectivités, DDT, EPF, développeurs photovoltaïques...) pour s'assurer de sa
        pertinence.
      </p>
      <p className="mb-4">
        Bénéfriches prend en compte un grand nombre de données pour vous offrir une vision complète
        des impacts de votre projet : sur les finances de la collectivité, l'emploi, la qualité de
        vie des riverains, l'environnement, etc.
      </p>
      <p className="mb-0">
        Vous souhaitez en savoir plus sur le mode de calcul ? On vous dit tout dans{" "}
        <button
          type="button"
          className="fr-link"
          aria-controls={FAQ_DIALOG_ID}
          data-fr-opened={false}
        >
          cette notice
        </button>
        .
      </p>
    </OnboardingStepShell>
  );
}
