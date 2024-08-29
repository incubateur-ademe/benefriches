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
  projectId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
  onBack: () => void;
};

function MixedUseNeighbourhoodCreationResult({ projectId, siteName, loadingState, onBack }: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return <LoadingSpinner loadingText='Création du projet "Quartier", veuillez patienter...' />;
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du projet">
          <Alert
            description={`Une erreur est survenue lors de la création du projet "Quartier", veuillez réessayer.`}
            severity="error"
            title="Le projet n'a pas pu être enregistré"
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
          <EditorialPageTitle>Le projet "Quartier" est créé !</EditorialPageTitle>
          <EditorialPageText>
            Bénéfriches a généré, au sein du site "{siteName}", un projet de quartier comprenant des
            habitations, des espaces verts et des espaces publics.
          </EditorialPageText>
          <Button size="large" linkProps={routes.projectImpacts({ projectId }).link}>
            Calculer les impacts
          </Button>
        </EditorialPageLayout>
      );
  }
}

export default MixedUseNeighbourhoodCreationResult;
