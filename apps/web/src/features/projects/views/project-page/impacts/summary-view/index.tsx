import { selectImpactsSummaryViewData } from "@/features/projects/core/projectImpacts.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const viewData = useAppSelector(selectImpactsSummaryViewData);

  return <ImpactSummaryView {...viewData} />;
};

export default ImpactsSummaryViewContainer;
