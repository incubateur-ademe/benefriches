import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import { BENEFRICHES_ENV } from "@/app/envVars";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectCurrentUserFullName } from "@/features/onboarding/core/user.reducer";
import { onboardingWelcomeHelpRequested } from "@/features/support/core/onboardingWelcomeHelpRequested.action";
import classNames from "@/shared/views/clsx";

import OnboardingStepShell from "../step-shell/OnboardingStepShell";
import type { OnboardingVariant } from "../step-shell/onboardingVariant";

const INTRO_PARAGRAPH =
  "Je m'appelle Mintsa Petit-Lambert et je suis chargé de déploiement chez Bénéfriches.";
const TOGETHER_PARAGRAPH =
  "Nous allons passer un petit moment ensemble pour évaluer les impacts socio-économiques liés à votre projet d'aménagement.";
const CONTACT_PARAGRAPH =
  "À tout moment, vous pouvez me contacter pour une démo de l'outil via le bouton message en bas à droite de votre écran.";

type Props = {
  variant?: OnboardingVariant;
};

export default function OnboardingWelcomePage({ variant }: Props) {
  const dispatch = useAppDispatch();
  const fullName = useAppSelector(selectCurrentUserFullName);
  const heading = fullName ? `Bonjour, ${fullName} !` : "Bonjour !";

  return (
    <OnboardingStepShell step="welcome" variant={variant} htmlTitle="Bienvenue - Premiers pas">
      <h2 className={classNames(fr.cx("fr-text--lg", "fr-text--bold"), "mb-4")}>{heading}</h2>
      <p className="mb-4">{INTRO_PARAGRAPH}</p>
      <p className="mb-4">{TOGETHER_PARAGRAPH}</p>
      <p className="mb-0">{CONTACT_PARAGRAPH}</p>
      {BENEFRICHES_ENV.crispEnabled && (
        <Button
          type="button"
          priority="secondary"
          iconId="ri-chat-3-line"
          className="mt-4"
          onClick={() => {
            void dispatch(onboardingWelcomeHelpRequested());
          }}
        >
          Contacter Mintsa
        </Button>
      )}
    </OnboardingStepShell>
  );
}
