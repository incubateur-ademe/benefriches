import { completeSoilsSummary, revertStep } from "@/features/create-site/core/createSite.reducer";
import { selectSiteSoilsSummaryViewData } from "@/features/create-site/core/selectors/spaces.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsSummary from "./SiteSoilsSummary";

function SiteSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const { soilsDistribution, totalSurfaceArea, wasSoilsDistributionAssignedByBenefriches } =
    useAppSelector(selectSiteSoilsSummaryViewData);

  return (
    <SiteSoilsSummary
      onNext={() => dispatch(completeSoilsSummary())}
      onBack={() => {
        dispatch(revertStep());
      }}
      soilsDistribution={soilsDistribution}
      totalSurfaceArea={totalSurfaceArea}
      wasSoilsDistributionAssignedByBenefriches={wasSoilsDistributionAssignedByBenefriches}
    />
  );
}

export default SiteSoilsSummaryContainer;
