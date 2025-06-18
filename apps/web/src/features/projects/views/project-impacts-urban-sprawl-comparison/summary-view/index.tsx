import { getSummaryIndicatorsComparison } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/summary.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const keyImpactIndicators = useAppSelector(getSummaryIndicatorsComparison);

  return <ImpactSummaryView {...keyImpactIndicators} />;
};

export default ImpactsSummaryViewContainer;
