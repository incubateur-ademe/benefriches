import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import ProjectFeaturesView from "@/features/projects/views/project-page/features/ProjectFeaturesView";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";
import { routes } from "@/shared/views/router";

type Props = {
  projectId: string;
  projectName: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
  projectFeatures?: ProjectFeatures;
  onBack: () => void;
};

function UrbanProjectCreationResult({
  projectId,
  projectName,
  siteName,
  loadingState,
  onBack,
  projectFeatures,
}: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return (
        <LoadingSpinner
          loadingText={`Création du projet "${projectName}", veuillez patienter...`}
        />
      );
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du projet">
          <Alert
            description={`Une erreur est survenue lors de la création du projet "${projectName}", veuillez réessayer.`}
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
          <EditorialPageTitle>Le projet "{projectName}" est créé !</EditorialPageTitle>
          <EditorialPageText>
            💡 Bénéfriches a affecté des données par défaut pour créer le projet sur "{siteName}".
            <br />
            Ces données sont basées sur les moyennes observées pour ce type de site.
            <br />
            <br />
            {projectFeatures && (
              <div className="tw-text-base">
                <ProjectFeaturesView projectData={projectFeatures} />
              </div>
            )}
          </EditorialPageText>
          <Button size="large" linkProps={routes.projectImpactsOnboarding({ projectId }).link}>
            Consulter les impacts
          </Button>
        </EditorialPageLayout>
      );
  }
}

export default UrbanProjectCreationResult;
