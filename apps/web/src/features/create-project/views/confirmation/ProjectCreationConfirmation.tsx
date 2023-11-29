import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { routes } from "@/router";

type Props = {
  projectName: string;
  projectId: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

function ProjectCreationConfirmation({
  projectId,
  projectName,
  loadingState,
}: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return <p>Création du projet "{projectName}", veuillez patienter...</p>;
    case "error":
      return (
        <p>
          Une erreur est survenue lors de la création du projet "{projectName}",
          veuillez réessayer.
        </p>
      );
    case "success":
      return (
        <>
          <h2>✅ Le projet "{projectName}" est créé !</h2>
          <p>
            Vous pouvez maintenant découvrir ses impacts, comparer ce projet
            avec un autre projet ou bien retourner à votre liste de projets,
            pour créer un nouveau projet ou un nouveau site.
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
                children: "Comparer les impacts",
                linkProps: routes.selectProjectToCompare({
                  baseProjectId: projectId,
                }).link,
              },
            ]}
            inlineLayoutWhen="always"
          />
        </>
      );
  }
}

export default ProjectCreationConfirmation;
