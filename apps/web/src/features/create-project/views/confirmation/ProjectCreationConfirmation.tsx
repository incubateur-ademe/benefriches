import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { routes } from "@/router";

type Props = {
  siteName: string;
  projectName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

function ProjectCreationConfirmation({
  projectName,
  siteName,
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
            Vous pouvez maintenant découvrir ses impacts, comparer votre projet
            avec un statut quo ou bien renseigner un nouveau projet sur le site
            « {siteName} » en retournant sur la liste des projets.
          </p>
          <ButtonsGroup
            buttons={[
              {
                priority: "secondary",
                children: "Retour à mes projets",
                linkProps: routes.myProjects().link,
              },
            ]}
            inlineLayoutWhen="always"
          />
        </>
      );
  }
}

export default ProjectCreationConfirmation;
