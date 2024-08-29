import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

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
  loadingState: "idle" | "loading" | "success" | "error";
  onBack: () => void;
};

function SiteCreationResult({ siteId, siteName, loadingState, onBack }: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return (
        <LoadingSpinner loadingText={`Création du site « ${siteName} », veuillez patienter...`} />
      );
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du site">
          <Alert
            description={`Une erreur est survenue lors de la création du site « ${siteName} », veuillez réessayer.`}
            severity="error"
            title="Le site n'a pas pu être enregistré"
            className="fr-my-7v"
          />
          <Button onClick={onBack} priority="secondary">
            Précédent
          </Button>
        </WizardFormLayout>
      );
    case "success":
      return (
        <EditorialPageLayout>
          <EditorialPageIcon>✅</EditorialPageIcon>
          <EditorialPageTitle>Le site « {siteName} » est créé !</EditorialPageTitle>
          <EditorialPageText>
            Vous pouvez maintenant renseigner un projet sur ce site avant de pouvoir calculer les
            impacts qui lui sont associés.
          </EditorialPageText>
          <Button size="large" linkProps={routes.createProjectIntro({ siteId }).link}>
            Renseigner mon projet sur ce site
          </Button>
        </EditorialPageLayout>
      );
  }
}

export default SiteCreationResult;
