import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { urbanSprawlComparisonOnboardingCompleted } from "@/features/projects/application/project-impacts/actions/urbanSprawlComparisonOnboardingSkip.action";
import { selectAvoidedUrbanSprawlCostsAnalysisDataView } from "@/features/projects/application/project-impacts/projectAvoidedCostsAnalysis.selectors";
import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";

import UrbanSprawlImpactsComparisonIntroductionModal from "./IntroModal";

type Props = {
  projectType: ProjectDevelopmentPlanType;
};

export default function UrbanSprawlImpactsComparisonIntroductionModalContainer({
  projectType,
}: Props) {
  const dispatch = useAppDispatch();

  const avoidedUrbanSprawlCostsAnalysisDataView = useAppSelector(
    selectAvoidedUrbanSprawlCostsAnalysisDataView,
  );

  const onCompleteOnBoarding = () => {
    dispatch(urbanSprawlComparisonOnboardingCompleted());
  };

  return (
    <UrbanSprawlImpactsComparisonIntroductionModal
      onFinalNext={() => {
        onCompleteOnBoarding();
      }}
      dataLoadingState={avoidedUrbanSprawlCostsAnalysisDataView?.dataLoadingState}
      projectName={avoidedUrbanSprawlCostsAnalysisDataView?.projectName}
      projectType={projectType}
      baseSiteData={avoidedUrbanSprawlCostsAnalysisDataView?.conversionSiteData}
      comparisonSiteData={
        avoidedUrbanSprawlCostsAnalysisDataView?.urbanSprawlSimulation?.simulationSiteData
      }
    />
  );
}
