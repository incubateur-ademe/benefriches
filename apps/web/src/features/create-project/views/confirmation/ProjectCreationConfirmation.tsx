import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/views/router";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  projectName: string;
  projectId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

function ProjectCreationConfirmation({ projectId, projectName, siteName, loadingState }: Props) {
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
            className="fr-my-7v"
          />
        </WizardFormLayout>
      );
    case "success":
      return (
        <section className="tw-py-7 lg:tw-px-[200px]">
          <div className="tw-text-[80px] tw-mb-10 tw-leading-none">✅</div>
          <h2 className="tw-mb-10">Le projet « {projectName} » est créé !</h2>
          <p className="tw-text-xl tw-mb-10">
            Bénéfriches peut maintenant calculer les impacts sociaux, économiques et
            environnementaux de ce projet sur le site « {siteName} ».
          </p>
          <Button size="large" linkProps={routes.projectImpacts({ projectId }).link}>
            Calculer les impacts
          </Button>
        </section>
      );
  }
}

export default ProjectCreationConfirmation;
