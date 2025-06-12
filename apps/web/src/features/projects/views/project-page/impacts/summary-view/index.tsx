import { selectModalData } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import { getKeyImpactIndicatorsListSelector } from "@/features/projects/application/project-impacts/projectKeyImpactIndicators.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const keyImpactIndicatorsList = useAppSelector(getKeyImpactIndicatorsListSelector);

  const modalData = useAppSelector(selectModalData);

  return (
    <ImpactSummaryView keyImpactIndicatorsList={keyImpactIndicatorsList} modalData={modalData} />
  );
};

export default ImpactsSummaryViewContainer;
