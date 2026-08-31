import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteSoilsSummary from "./SiteSoilsSummary";

function SiteSoilsSummaryContainer() {
  const { onBack, onNext, selectSiteSoilsSummaryViewData } = useCustomSiteForm();
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
      onNext={onNext}
      onBack={() => {
        onBack();
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
