import { selectImpactsListViewData } from "@/features/projects/core/projectImpacts.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactsListView from "./ImpactsListView";

const ImpactsListViewContainer = () => {
  const viewData = useAppSelector(selectImpactsListViewData);

  return <ImpactsListView {...viewData} />;
};

export default ImpactsListViewContainer;
