import { useEffect } from "react";
import { fetchReconversionProjectImpacts } from "../../application/fetchReconversionProjectImpacts.action";
import {
  selectMainKeyImpactIndicators,
  selectProjectOverallImpact,
} from "../../application/projectImpactsSynthetics.selectors";
import ProjectImpactsOnboardingPage from "./ProjectImpactsOnboardingPage";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  projectId: string;
};

function ProjectImpactsOnboardingPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { evaluationPeriod } = useAppSelector((state) => state.projectImpacts);
  const projectOverallImpact = useAppSelector(selectProjectOverallImpact);
  const mainKeyImpactIndicators = useAppSelector(selectMainKeyImpactIndicators);

  useEffect(() => {
    void dispatch(fetchReconversionProjectImpacts({ projectId, evaluationPeriod }));
  }, [projectId, evaluationPeriod, dispatch]);

  return (
    <ProjectImpactsOnboardingPage
      projectId={projectId}
      projectOverallImpact={projectOverallImpact}
      mainKeyImpactIndicators={mainKeyImpactIndicators}
      evaluationPeriod={evaluationPeriod}
    />
  );
}

export default ProjectImpactsOnboardingPageContainer;
