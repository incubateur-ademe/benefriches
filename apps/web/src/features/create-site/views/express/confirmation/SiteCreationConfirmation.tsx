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

function SiteCreationConfirmation({ siteId, siteName, loadingState, onBack }: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return <LoadingSpinner loadingText={`Création du site, veuillez patienter...`} />;
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du site">
          <Alert
            description={`Une erreur est survenue lors de la création du site, veuillez réessayer.`}
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
            Bénéfriches a affecté des données par défaut, notamment pour la typologie des sols et
            les dépenses de gestion.{" "}
            <a href={routes.siteFeatures({ siteId }).href}>
              Consulter les données du site utilisées par Bénéfriches
            </a>
          </EditorialPageText>
          <EditorialPageText>
            Vous pouvez maintenant renseigner un projet sur ce site, en mode express ou en mode
            personnalisé.
          </EditorialPageText>
          <Button size="large" linkProps={routes.createProjectIntro({ siteId }).link}>
            Suivant
          </Button>
        </EditorialPageLayout>
      );
  }
}

export default SiteCreationConfirmation;
