import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";
import { routes } from "@/shared/views/router";

type Props = {
  projectName: string;
  projectId: string;
  loadingState: "idle" | "dirty" | "loading" | "success" | "error";
  onBack: () => void;
  shouldGoThroughOnboarding: boolean;
};

function ProjectCreationResult({
  projectId,
  projectName,
  loadingState,
  onBack,
  shouldGoThroughOnboarding,
}: Props) {
  switch (loadingState) {
    case "idle":
    case "dirty":
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
            title="Le projet n'a pas pu être sauvegardé"
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
          <EditorialPageTitle>Le projet « {projectName} » est créé !</EditorialPageTitle>
          <EditorialPageText>
            Ses impacts ont été calculés et sont prêts à être consultés.
          </EditorialPageText>
          {shouldGoThroughOnboarding ? (
            <>
              <EditorialPageText>Mais avant cela, 3 informations importantes.</EditorialPageText>
              <EditorialPageButtonsSection>
                <Button
                  size="large"
                  linkProps={routes.projectImpactsOnboarding({ projectId }).link}
                >
                  Voir les infos importantes
                </Button>
              </EditorialPageButtonsSection>
            </>
          ) : (
            <EditorialPageButtonsSection>
              <Button size="large" linkProps={routes.projectImpacts({ projectId }).link}>
                Consulter les impacts
              </Button>
            </EditorialPageButtonsSection>
          )}
        </EditorialPageLayout>
      );
  }
}

export default ProjectCreationResult;
