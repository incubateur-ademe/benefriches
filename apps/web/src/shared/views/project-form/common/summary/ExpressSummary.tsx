import Alert from "@codegouvfr/react-dsfr/Alert";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import ProjectFeaturesView from "@/features/projects/views/project-page/features/ProjectFeaturesView";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  siteName: string;
  onNext: () => void;
  onBack: () => void;
  projectData?: ProjectFeatures;
  loadingState: "success" | "idle" | "error" | "loading";
};

function ProjectExpressSummary({ projectData, loadingState, siteName, onBack, onNext }: Props) {
  return (
    <WizardFormLayout title="Récapitulatif du projet">
      {(() => {
        switch (loadingState) {
          case "error":
            return (
              <Alert
                description={`Une erreur est survenue lors de la génération du projet, veuillez réessayer.`}
                severity="error"
                title="Le projet n'a pas pu être généré"
                className="my-7"
              />
            );
          case "loading":
            return <LoadingSpinner />;

          case "success":
            return (
              <>
                <p
                  className={classNames(
                    "border-border-grey",
                    "border-solid",
                    "border",
                    "shadow-md",
                    "rounded-lg",
                    "p-4",
                  )}
                >
                  💡 Bénéfriches a affecté des données par défaut pour créer le projet sur "
                  {siteName}".
                  <br />
                  Ces données sont basées sur les moyennes observées pour ce type de site.
                </p>
                <ProjectFeaturesView projectData={projectData!} />
              </>
            );
        }
      })()}
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} nextLabel="Valider" />
    </WizardFormLayout>
  );
}

export default ProjectExpressSummary;
