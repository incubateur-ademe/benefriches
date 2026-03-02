import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectImpactsSummaryViewData } from "@/features/projects/core/projectImpacts.selectors";

import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const viewData = useAppSelector(selectImpactsSummaryViewData);

  return <ImpactSummaryView {...viewData} />;
};

export default ImpactsSummaryViewContainer;
