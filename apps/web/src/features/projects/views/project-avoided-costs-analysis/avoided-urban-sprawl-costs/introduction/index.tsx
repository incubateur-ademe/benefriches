import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { urbanSprawlComparisonOnboardingCompleted } from "@/features/projects/application/project-impacts/actions/urbanSprawlComparisonOnboardingSkip.action";
import { selectAvoidedUrbanSprawlCostsAnalysisDataView } from "@/features/projects/application/project-impacts/selectors/projectAvoidedCostsAnalysis.selectors";

import UrbanSprawlImpactsComparisonIntroductionModal from "./IntroModal";

export default function UrbanSprawlImpactsComparisonIntroductionModalContainer() {
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
      contextData={avoidedUrbanSprawlCostsAnalysisDataView?.contextData}
      comparisonSiteData={
        avoidedUrbanSprawlCostsAnalysisDataView?.urbanSprawlSimulation?.simulationSiteData
      }
    />
  );
}
