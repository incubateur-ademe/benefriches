import Button from "@codegouvfr/react-dsfr/Button";

import { BENEFRICHES_ENV } from "@/app/envVars";
import { useAppDispatch } from "@/app/hooks/store.hooks";
import { onboardingWelcomeHelpRequested } from "@/features/support/core/onboardingWelcomeHelpRequested.action";

import OnboardingStepShell from "../step-shell/OnboardingStepShell";

// Best-effort copy: the real Figma copy (file tgMAVc4oAfXQ3a8NRURmcF, node 28571:5857) was not
// reachable from this environment. These strings need design confirmation before shipping.
const HEADING = "Bonjour, je suis Mintsa !";
const INTRO_PARAGRAPH =
  "Je m'appelle Mintsa Petit-Lambert, chargé de déploiement chez Bénéfriches, et je vous accompagne pendant vos premiers pas sur l'outil.";
const CONTACT_PARAGRAPH = "Une question ? Contactez-moi directement via la messagerie.";
const CONTACT_BUTTON_LABEL = "Contacter Mintsa";

export default function OnboardingWelcomePage() {
  const dispatch = useAppDispatch();

  return (
    <OnboardingStepShell step="welcome" htmlTitle="Bienvenue - Premiers pas">
      <h2 className="mb-4">{HEADING}</h2>
      <p className="mb-4">{INTRO_PARAGRAPH}</p>
      {BENEFRICHES_ENV.crispEnabled && (
        <>
          <p className="mb-4">{CONTACT_PARAGRAPH}</p>
          <Button
            type="button"
            priority="secondary"
            iconId="ri-chat-3-line"
            onClick={() => {
              void dispatch(onboardingWelcomeHelpRequested());
            }}
          >
            {CONTACT_BUTTON_LABEL}
          </Button>
        </>
      )}
    </OnboardingStepShell>
  );
}
