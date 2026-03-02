import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectImpactsChartsViewData } from "@/features/projects/core/projectImpacts.selectors";

import ImpactsChartsView from "./ImpactsChartsView";

const ImpactsChartsViewContainer = () => {
  const viewData = useAppSelector(selectImpactsChartsViewData);

  return <ImpactsChartsView {...viewData} />;
};

export default ImpactsChartsViewContainer;
