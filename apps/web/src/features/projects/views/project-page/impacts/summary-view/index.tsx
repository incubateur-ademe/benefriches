import ImpactSummaryView from "./ImpactSummaryView";

import {
  getCategoryFilter,
  getKeyImpactIndicatorsList,
} from "@/features/projects/application/projectKeyImpactIndicators.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

const ImpactsSummaryViewContainer = () => {
  const categoryFilter = useAppSelector(getCategoryFilter);
  const keyImpactIndicatorsList = useAppSelector(getKeyImpactIndicatorsList);

  return (
    <ImpactSummaryView
      categoryFilter={categoryFilter}
      keyImpactIndicatorsList={keyImpactIndicatorsList}
    />
  );
};

export default ImpactsSummaryViewContainer;
