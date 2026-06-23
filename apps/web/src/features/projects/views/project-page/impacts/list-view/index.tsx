import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectImpactsListViewData } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

import ImpactsListView from "./ImpactsListView";

const ImpactsListViewContainer = () => {
  const viewData = useAppSelector(selectImpactsListViewData);

  return <ImpactsListView {...viewData} />;
};

export default ImpactsListViewContainer;
