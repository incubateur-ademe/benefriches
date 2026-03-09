import type { UrbanZoneLandParcelType } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectLandParcelsSurfaceDistributionViewData } from "@/features/create-site/core/urban-zone/steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import LandParcelsSurfaceDistributionForm, {
  type FormValues,
} from "./LandParcelsSurfaceDistributionForm";

function LandParcelsSurfaceDistributionContainer() {
  const dispatch = useAppDispatch();
  const { selectedParcelTypes, totalSurfaceArea, initialSurfaceAreas } = useAppSelector(
    selectLandParcelsSurfaceDistributionViewData,
  );

  return (
    <LandParcelsSurfaceDistributionForm
      selectedParcelTypes={selectedParcelTypes}
      totalSurfaceArea={totalSurfaceArea}
      initialValues={initialSurfaceAreas}
      onSubmit={(data: FormValues) => {
        const surfaceAreas = data as Record<UrbanZoneLandParcelType, number>;
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
            answers: { surfaceAreas },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default LandParcelsSurfaceDistributionContainer;
