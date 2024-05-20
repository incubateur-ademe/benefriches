import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/views/router";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

function SiteCreationConfirmation({ siteId, siteName, loadingState }: Props) {
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
        </WizardFormLayout>
      );
    case "success":
      return (
        <WizardFormLayout title={`✅ Le site « ${siteName} » est créé !`}>
          <p>Bravo, vous avez fait la moitié du chemin !</p>
          <p>
            Pour consulter les impacts d’un projet sur ce site, il vous faut maintenant renseigner
            ce projet.
          </p>
          <Button linkProps={routes.createProjectIntro({ siteId }).link}>
            Renseigner mon projet sur ce site
          </Button>
        </WizardFormLayout>
      );
  }
}

export default SiteCreationConfirmation;
