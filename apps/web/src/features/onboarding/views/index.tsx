import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/router";

function OnboardingPage() {
  return (
    <>
      <h1>Tout commence sur un site foncier</h1>
      <p>
        Nous allons d’abord parler du site existant : la nature du site, la
        typologie de ses sols, les dépenses associées, etc.
      </p>
      <p>
        Une fois que ce site sera décrit, vous pourrez alors créer un ou
        plusieurs projets d’aménagement sur ce site.
      </p>

      <Button linkProps={routes.createSiteFoncierDocuments().link}>
        Commencer
      </Button>
    </>
  );
}

export default OnboardingPage;
