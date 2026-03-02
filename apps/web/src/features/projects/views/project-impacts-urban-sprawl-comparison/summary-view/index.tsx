import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectUrbanSprawlSummaryViewData } from "@/features/projects/core/urbanSprawlComparison.selectors";

import ImpactSummaryView from "./ImpactSummaryView";

const ImpactsSummaryViewContainer = () => {
  const { baseCase, comparisonCase, modalData } = useAppSelector(selectUrbanSprawlSummaryViewData);

  return (
    <ImpactSummaryView baseCase={baseCase} comparisonCase={comparisonCase} modalData={modalData} />
  );
};

export default ImpactsSummaryViewContainer;
