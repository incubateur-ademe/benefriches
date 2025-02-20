import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import { fetchImpactsForReconversionProject } from "../../application/fetchImpactsForReconversionProject.action";
import {
  selectMainKeyImpactIndicators,
  selectProjectOverallImpact,
} from "../../application/projectKeyImpactIndicators.selectors";
import ProjectImpactsOnboardingPage from "./ProjectImpactsOnboardingPage";

type Props = {
  projectId: string;
};

function ProjectImpactsOnboardingPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { evaluationPeriod, dataLoadingState } = useAppSelector((state) => state.projectImpacts);
  const projectOverallImpact = useAppSelector(selectProjectOverallImpact);
  const mainKeyImpactIndicators = useAppSelector(selectMainKeyImpactIndicators);

  useEffect(() => {
    void dispatch(fetchImpactsForReconversionProject({ projectId, evaluationPeriod }));
  }, [projectId, evaluationPeriod, dispatch]);

  if (dataLoadingState === "error") {
    return (
      <Alert
        description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
        severity="error"
        title="Impossible de charger les impacts du projet"
        className="tw-my-7"
      />
    );
  }

  if (dataLoadingState === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <ProjectImpactsOnboardingPage
      onFinalNext={() => {
        routes.projectImpacts({ projectId }).push();
      }}
      projectOverallImpact={projectOverallImpact}
      mainKeyImpactIndicators={mainKeyImpactIndicators}
      evaluationPeriod={evaluationPeriod}
    />
  );
}

export default ProjectImpactsOnboardingPageContainer;
