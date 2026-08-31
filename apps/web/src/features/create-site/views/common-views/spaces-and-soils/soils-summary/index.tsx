import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";
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
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => {
        dispatch(previousStepRequested());
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
