import { selectImpactsChartsViewData } from "@/features/projects/core/projectImpacts.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactsChartsView from "./ImpactsChartsView";

const ImpactsChartsViewContainer = () => {
  const viewData = useAppSelector(selectImpactsChartsViewData);

  return <ImpactsChartsView {...viewData} />;
};

export default ImpactsChartsViewContainer;
