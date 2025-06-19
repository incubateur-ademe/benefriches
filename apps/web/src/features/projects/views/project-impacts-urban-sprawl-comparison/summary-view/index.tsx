import { getSummaryIndicatorsComparison } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/summary.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const keyImpactIndicators = useAppSelector(getSummaryIndicatorsComparison);
  const comparisonState = useAppSelector((state) => state.urbanSprawlComparison);

  return (
    <ImpactSummaryView
      {...keyImpactIndicators}
      modalData={{
        baseCase: comparisonState.baseCase!,
        comparisonCase: comparisonState.comparisonCase!,
        projectData: comparisonState.projectData!,
      }}
    />
  );
};

export default ImpactsSummaryViewContainer;
