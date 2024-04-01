import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { ProjectImpactsState } from "../../application/projectImpacts.reducer";
import ProjectImpactsPage from "./ProjectImpactsPage";

type Props = ProjectImpactsState & {
  onEvaluationPeriodChange: (n: number) => void;
  evaluationPeriod: number;
};

function ProjectImpactsPageWrapper({
  projectData,
  impactsData,
  dataLoadingState,
  onEvaluationPeriodChange,
  evaluationPeriod,
}: Props) {
  if (dataLoadingState === "loading") {
    return <div className={fr.cx("fr-container", "fr-py-3v")}>Chargement en cours ...</div>;
  }

  if (dataLoadingState === "error") {
    return (
      <div className={fr.cx("fr-container", "fr-py-3v")}>
        <Alert
          description="Une erreur s’est produite lors du chargement des données."
          severity="error"
          title="Impossible de charger les impacts du projet"
          className="fr-my-7v"
        />
      </div>
    );
  }

  if (dataLoadingState === "success") {
    return (
      <ProjectImpactsPage
        project={projectData!}
        impacts={impactsData!}
        evaluationPeriod={evaluationPeriod}
        onEvaluationPeriodChange={onEvaluationPeriodChange}
      />
    );
  }
}

export default ProjectImpactsPageWrapper;
