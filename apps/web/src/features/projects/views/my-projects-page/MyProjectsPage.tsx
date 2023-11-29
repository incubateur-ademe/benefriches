import Button from "@codegouvfr/react-dsfr/Button";
import { ProjectsGroupedBySite } from "../../domain/projects.types";
import MyProjectsPageHeader from "./MyProjectsPageHeader";
import ProjectsList from "./ProjectsList";

import { routes } from "@/router";

type Props = {
  loadingState: "idle" | "loading" | "error" | "success";
  projectsList: ProjectsGroupedBySite;
};

function MyProjectsPage({ loadingState, projectsList }: Props) {
  const getProjectListsPageContent = () => {
    if (loadingState === "loading") return <p>Chargement de vos projets...</p>;

    if (loadingState === "error")
      return (
        <p>
          Une erreur est survenue lors du chargement de vos projets. Veuillez
          recharger la page.
        </p>
      );

    if (loadingState === "success") {
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
              linkProps={routes.createSiteFoncierIntro().link}
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
      <MyProjectsPageHeader />
      {getProjectListsPageContent()}
    </>
  );
}

export default MyProjectsPage;
