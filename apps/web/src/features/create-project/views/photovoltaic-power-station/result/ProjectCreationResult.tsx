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
  projectName: string;
  projectId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
  onBack: () => void;
};

function ProjectCreationResult({ projectId, projectName, siteName, loadingState, onBack }: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return (
        <LoadingSpinner
          loadingText={`Création du projet « ${projectName} », veuillez patienter...`}
        />
      );
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du projet">
          <Alert
            description={`Une erreur est survenue lors de la création du projet « ${projectName} », veuillez réessayer.`}
            severity="error"
            title="Le projet n'a pas pu être enregistré"
            className="tw-my-7"
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
          <EditorialPageTitle>Le projet « {projectName} » est créé !</EditorialPageTitle>
          <EditorialPageText>
            Bénéfriches peut maintenant calculer les impacts sociaux, économiques et
            environnementaux de ce projet sur le site « {siteName} ».
          </EditorialPageText>
          <Button size="large" linkProps={routes.projectImpactsOnboarding({ projectId }).link}>
            Consulter les impacts
          </Button>
        </EditorialPageLayout>
      );
  }
}

export default ProjectCreationResult;
