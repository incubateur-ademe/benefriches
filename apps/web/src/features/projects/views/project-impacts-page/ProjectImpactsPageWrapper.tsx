import Alert from "@codegouvfr/react-dsfr/Alert";
import { ProjectImpactsState } from "../../application/projectImpacts.reducer";
import ProjectImpactsPage from "./ProjectImpactsPage";

function ProjectImpactsPageWrapper({
  projectData,
  impactsData,
  dataLoadingState,
}: ProjectImpactsState) {
  if (dataLoadingState === "loading") {
    return <p>Chargement en cours ...</p>;
  }

  if (dataLoadingState === "error") {
    return (
      <Alert
        description="Une erreur s’est produite lors du chargement des données."
        severity="error"
        title="Erreur"
        className="fr-my-7v"
      />
    );
  }

  if (dataLoadingState === "success") {
    return <ProjectImpactsPage project={projectData!} impacts={impactsData!} />;
  }
}

export default ProjectImpactsPageWrapper;
