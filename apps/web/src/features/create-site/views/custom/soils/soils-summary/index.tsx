import { completeSoilsSummary, revertStep } from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsSummary from "./SiteSoilsSummary";

function SiteSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return (
    <SiteSoilsSummary
      onNext={() => dispatch(completeSoilsSummary())}
      onBack={() => {
        dispatch(revertStep());
      }}
      soilsDistribution={siteData.soilsDistribution ?? {}}
      totalSurfaceArea={siteData.surfaceArea ?? 0}
    />
  );
}

export default SiteSoilsSummaryContainer;
