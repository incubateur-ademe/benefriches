import type { UrbanZoneLandParcelType } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import LandParcelsSurfaceDistributionForm, {
  type FormValues,
} from "./LandParcelsSurfaceDistributionForm";

function LandParcelsSurfaceDistributionContainer() {
  const { onBack, onRequestStepCompletion, selectLandParcelsSurfaceDistributionViewData } =
    useUrbanZoneSiteForm();
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
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
          answers: { surfaceAreas },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default LandParcelsSurfaceDistributionContainer;
