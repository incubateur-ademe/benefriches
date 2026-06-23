import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import { selectAvoidedCostsAnalysisDataView } from "../../application/project-impacts/selectors/projectAvoidedCostsAnalysis.selectors";
import { selectDisplayOnboarding } from "../../application/project-impacts/selectors/projectUrbanSprawlComparisonOnboardingSkip.selector";
import ProjectAvoidedCostsAnalysisPage from "./ProjectAvoidedCostsAnalysisPage";

type Props = {
  projectId: string;
};

export default function ProjectAvoidedCostsAnalysisContainer({ projectId }: Props) {
  const avoidedCostsAnalysisDataView = useAppSelector(selectAvoidedCostsAnalysisDataView);
  const shouldDisplayOnBoarding = useAppSelector(selectDisplayOnboarding);
  const dispatch = useAppDispatch();

  if (!avoidedCostsAnalysisDataView) {
    return null;
  }

  return (
    <ProjectAvoidedCostsAnalysisPage
      onEvaluationPeriodChange={(evaluationPeriodInYears: number) => {
        void dispatch(evaluationPeriodUpdated({ evaluationPeriodInYears }));
      }}
      projectId={projectId}
      shouldDisplayOnBoarding={shouldDisplayOnBoarding}
      {...avoidedCostsAnalysisDataView}
    />
  );
}
