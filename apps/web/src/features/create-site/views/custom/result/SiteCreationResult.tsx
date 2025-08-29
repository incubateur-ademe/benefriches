import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";
import { routes } from "@/shared/views/router";

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
            className="my-7"
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
          <Button size="large" linkProps={routes.createProject({ siteId }).link}>
            Renseigner mon projet sur ce site
          </Button>
        </EditorialPageLayout>
      );
  }
}

export default SiteCreationResult;
