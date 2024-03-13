import Alert from "@codegouvfr/react-dsfr/Alert";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { routes } from "@/app/views/router";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  projectName: string;
  projectId: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

function ProjectCreationConfirmation({ projectId, projectName, loadingState }: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return <p>Création du projet "{projectName}", veuillez patienter...</p>;
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du site">
          <Alert
            description={`Une erreur est survenue lors de la création du projet "${projectName}", veuillez réessayer.`}
            severity="error"
            title="Le site n’a pas pu être enregistré"
            className="fr-my-7v"
          />
        </WizardFormLayout>
      );
    case "success":
      return (
        <WizardFormLayout title={`✅ Le projet "${projectName}" est créé !`}>
          <p>
            Vous pouvez maintenant découvrir ses impacts, comparer ce projet avec un autre projet ou
            bien retourner à votre liste de projets, pour créer un nouveau projet ou un nouveau
            site.
          </p>
          <ButtonsGroup
            buttons={[
              {
                priority: "secondary",
                children: "Retour à mes projets",
                linkProps: routes.myProjects().link,
              },
              {
                priority: "primary",
                children: "Découvrir les impacts",
                linkProps: routes.projectImpacts({ projectId }).link,
              },
              {
                priority: "primary",
                children: "Comparer les impacts",
                linkProps: routes.selectProjectToCompare({
                  baseProjectId: projectId,
                }).link,
              },
            ]}
            inlineLayoutWhen="always"
          />
        </WizardFormLayout>
      );
  }
}

export default ProjectCreationConfirmation;
