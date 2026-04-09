import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsSummaryStepCompleted } from "@/features/create-site/core/steps/spaces/spaces.actions";
import { selectSiteSoilsSummaryViewData } from "@/features/create-site/core/steps/spaces/spaces.selectors";

import SiteSoilsSummary from "./SiteSoilsSummary";

function SiteSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const {
    soilsDistribution,
    totalSurfaceArea,
    wasSoilsDistributionAssignedByBenefriches,
    siteNature,
    agriculturalOperationActivity,
    naturalAreaType,
    fricheActivity,
    urbanZoneType,
  } = useAppSelector(selectSiteSoilsSummaryViewData);

  return (
    <SiteSoilsSummary
      onNext={() => dispatch(soilsSummaryStepCompleted())}
      onBack={() => {
        dispatch(stepReverted());
      }}
      soilsDistribution={soilsDistribution}
      totalSurfaceArea={totalSurfaceArea}
      wasSoilsDistributionAssignedByBenefriches={wasSoilsDistributionAssignedByBenefriches}
      siteNature={siteNature}
      agriculturalOperationActivity={agriculturalOperationActivity}
      naturalAreaType={naturalAreaType}
      fricheActivity={fricheActivity}
      urbanZoneType={urbanZoneType}
    />
  );
}

export default SiteSoilsSummaryContainer;
