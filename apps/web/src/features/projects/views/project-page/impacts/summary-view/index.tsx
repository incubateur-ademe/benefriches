import { getKeyImpactIndicatorsListSelector } from "@/features/projects/application/projectKeyImpactIndicators.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const keyImpactIndicatorsList = useAppSelector(getKeyImpactIndicatorsListSelector);

  return <ImpactSummaryView keyImpactIndicatorsList={keyImpactIndicatorsList} />;
};

export default ImpactsSummaryViewContainer;
