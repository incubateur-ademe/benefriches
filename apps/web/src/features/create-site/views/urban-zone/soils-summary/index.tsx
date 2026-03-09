import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectUrbanZoneSoilsSummaryViewData } from "@/features/create-site/core/urban-zone/steps/summary/soils-summary/soilsSummary.selectors";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";
import SiteSoilsSummary from "@/features/create-site/views/custom/spaces-and-soils/soils-summary/SiteSoilsSummary";

function UrbanZoneSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const { soilsDistribution, totalSurfaceArea } = useAppSelector(
    selectUrbanZoneSoilsSummaryViewData,
  );

  return (
    <SiteSoilsSummary
      soilsDistribution={soilsDistribution}
      totalSurfaceArea={totalSurfaceArea}
      wasSoilsDistributionAssignedByBenefriches={false}
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default UrbanZoneSoilsSummaryContainer;
