import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { soilsSummaryStepCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { selectSiteSoilsSummaryViewData } from "@/features/create-site/core/selectors/spaces.selectors";
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
        dispatch(stepRevertAttempted());
      }}
      soilsDistribution={soilsDistribution}
      totalSurfaceArea={totalSurfaceArea}
      wasSoilsDistributionAssignedByBenefriches={wasSoilsDistributionAssignedByBenefriches}
    />
  );
}

export default SiteSoilsSummaryContainer;
