import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsSummaryStepCompleted } from "@/features/create-site/core/steps/spaces/spaces.actions";
import { selectSiteSoilsSummaryViewData } from "@/features/create-site/core/steps/spaces/spaces.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsSummary from "./SiteSoilsSummary";

function SiteSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const { soilsDistribution, totalSurfaceArea, wasSoilsDistributionAssignedByBenefriches } =
    useAppSelector(selectSiteSoilsSummaryViewData);

  return (
    <SiteSoilsSummary
      onNext={() => dispatch(soilsSummaryStepCompleted())}
      onBack={() => {
        dispatch(stepReverted());
      }}
      soilsDistribution={soilsDistribution}
      totalSurfaceArea={totalSurfaceArea}
      wasSoilsDistributionAssignedByBenefriches={wasSoilsDistributionAssignedByBenefriches}
    />
  );
}

export default SiteSoilsSummaryContainer;
