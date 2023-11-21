import Button from "@codegouvfr/react-dsfr/Button";
import { ProjectsBySite } from "../../domain/projects.types";
import ProjectsList from "../ProjectsList";

import { routes } from "@/router";

type Props = {
  projectsListFetchingState: "idle" | "loading" | "error" | "success";
  projectsList: ProjectsBySite[];
};

function ProjectsListPage({ projectsListFetchingState, projectsList }: Props) {
  const getProjectListsPageContent = () => {
    if (projectsListFetchingState === "loading")
      return <p>Chargement de vos projets...</p>;

    if (projectsListFetchingState === "error")
      return (
        <p>
          Une erreur est survenue lors du chargement de vos projets. Veuillez
          recharger la page.
        </p>
      );

    if (projectsListFetchingState === "success") {
      if (projectsList.length === 0) {
        return (
          <>
            <p>Vous n'avez pas encore de projets.</p>
            <p>
              Pour démarrer, créez le site sur lequel vous prévoyez votre
              projet.
            </p>
            <Button
              priority="primary"
              linkProps={routes.createSiteFoncier().link}
            >
              Créer un site
            </Button>
          </>
        );
      }
      return <ProjectsList projectsList={projectsList} />;
    }
    return null;
  };

  return (
    <>
      <h2>Mes projets</h2>
      {getProjectListsPageContent()}
    </>
  );
}

export default ProjectsListPage;
