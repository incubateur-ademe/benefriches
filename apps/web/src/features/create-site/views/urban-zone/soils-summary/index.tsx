import { useAppSelector } from "@/app/hooks/store.hooks";
import SiteSoilsSummary from "@/features/create-site/views/common-views/spaces-and-soils/soils-summary/SiteSoilsSummary";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

function UrbanZoneSoilsSummaryContainer() {
  const { onBack, onNext, selectUrbanZoneSoilsSummaryViewData } = useUrbanZoneSiteForm();
  const { soilsDistribution, totalSurfaceArea } = useAppSelector(
    selectUrbanZoneSoilsSummaryViewData,
  );

  return (
    <SiteSoilsSummary
      soilsDistribution={soilsDistribution}
      totalSurfaceArea={totalSurfaceArea}
      wasSoilsDistributionAssignedByBenefriches={false}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default UrbanZoneSoilsSummaryContainer;
