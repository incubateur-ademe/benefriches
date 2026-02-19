import { selectUrbanSprawlSummaryViewData } from "@/features/projects/core/urbanSprawlComparison.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const { baseCase, comparisonCase, modalData } = useAppSelector(selectUrbanSprawlSummaryViewData);

  return (
    <ImpactSummaryView baseCase={baseCase} comparisonCase={comparisonCase} modalData={modalData} />
  );
};

export default ImpactsSummaryViewContainer;
