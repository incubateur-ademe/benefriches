import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectImpactsSummaryViewData } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

import ImpactModalDescription from "../../../impact-description-modals/ImpactModalDescription";
import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const viewData = useAppSelector(selectImpactsSummaryViewData);

  return (
    <ImpactModalDescription {...viewData.modalData}>
      <ImpactSummaryView {...viewData} />
    </ImpactModalDescription>
  );
};

export default ImpactsSummaryViewContainer;
