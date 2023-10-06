import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/router";

function OnboardingPage() {
  return (
    <>
      <h1>Tout commence sur un site foncier</h1>
      <p>
        La plupart des questions ne sont pas obligatoire. Vous pourrez venir
        plus tard les compléter.
      </p>

      <Button linkProps={routes.createSiteFoncier().link}>C’est parti</Button>
    </>
  );
}

export default OnboardingPage;
