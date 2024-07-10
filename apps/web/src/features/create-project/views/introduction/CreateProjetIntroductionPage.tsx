import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/views/router";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  siteId: string;
  siteName: string;
  siteLoadingState: "idle" | "loading" | "success" | "error";
};

function CreateProjectIntroductionPage({ siteId, siteName, siteLoadingState }: Props) {
  switch (siteLoadingState) {
    case "idle":
      return null;
    case "loading":
      return <LoadingSpinner />;
    case "error":
      return (
        <WizardFormLayout title="Le site demandé n'a pas pu être chargé">
          <p>
            Une erreur est survenue lors du chargement des informations du site, veuillez réessayer.
          </p>
        </WizardFormLayout>
      );
    case "success":
      return (
        <EditorialPageLayout>
          <EditorialPageIcon>🏗</EditorialPageIcon>
          <EditorialPageTitle>
            Vous avez un projet d'aménagement sur le site « {siteName} ».
          </EditorialPageTitle>
          <EditorialPageText>
            Nous allons ici parler de votre <strong>projet d'aménagement</strong> : la nature du
            projet, l'aménagement des espaces et la typologie des sols associée, les acteurs du
            projet, les coûts et recettes prévisionnels, le calendrier des travaux, etc.
          </EditorialPageText>
          <Button size="large" linkProps={routes.createProject({ siteId }).link}>
            Commencer
          </Button>
        </EditorialPageLayout>
      );
  }
}

export default CreateProjectIntroductionPage;
