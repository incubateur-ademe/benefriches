import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/router";

type Props = {
  siteId: string;
  siteName: string;
  siteLoadingState: "idle" | "loading" | "success" | "error";
};

function CreateProjectIntroductionPage({
  siteId,
  siteName,
  siteLoadingState,
}: Props) {
  switch (siteLoadingState) {
    case "idle":
      return null;
    case "loading":
      return <p>Chargement des informations du site, veuillez patienter...</p>;
    case "error":
      return (
        <p>
          Une erreur est survenue lors du chargement des informations du site,
          veuillez réessayer.
        </p>
      );
    case "success":
      return (
        <>
          <h2>Vous avez un projet d'aménagement sur le site "{siteName}".</h2>
          <Button linkProps={routes.createProject({ siteId }).link}>
            C'est parti !
          </Button>
        </>
      );
  }
}

export default CreateProjectIntroductionPage;
