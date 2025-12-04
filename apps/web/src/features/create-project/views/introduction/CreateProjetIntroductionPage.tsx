import { Button } from "@codegouvfr/react-dsfr/Button";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  siteName: string;
  siteLoadingState: "idle" | "loading" | "success" | "error";
};

function CreateProjectIntroductionPage({ onNext, siteName, siteLoadingState }: Props) {
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
          <EditorialPageIcon>🏗️</EditorialPageIcon>
          <EditorialPageTitle>
            Vous souhaitez évaluer un projet d'aménagement sur le site "{siteName}".
          </EditorialPageTitle>
          <EditorialPageText>
            Nous allons ici parler de votre <strong>projet d'aménagement</strong> : la nature du
            projet, l'aménagement des espaces et l'occupation des sols associée, les acteurs du
            projet, les dépenses et recettes prévisionnelles, le calendrier des travaux, etc.
          </EditorialPageText>
          <EditorialPageButtonsSection>
            <Button size="large" onClick={onNext}>
              Commencer
            </Button>
          </EditorialPageButtonsSection>
        </EditorialPageLayout>
      );
  }
}

export default CreateProjectIntroductionPage;
