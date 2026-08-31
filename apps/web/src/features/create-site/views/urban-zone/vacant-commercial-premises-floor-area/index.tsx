import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import VacantCommercialPremisesFloorAreaForm from "./VacantCommercialPremisesFloorAreaForm";

function VacantCommercialPremisesFloorAreaContainer() {
  const { onBack, onRequestStepCompletion, selectVacantCommercialPremisesFloorAreaViewData } =
    useUrbanZoneSiteForm();
  const { initialValue, vacantPremisesFootprintSurfaceArea } = useAppSelector(
    selectVacantCommercialPremisesFloorAreaViewData,
  );

  return (
    <VacantCommercialPremisesFloorAreaForm
      initialValue={initialValue}
      vacantFootprintSurfaceArea={vacantPremisesFootprintSurfaceArea}
      onSubmit={({ surfaceArea }) => {
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
          answers: { surfaceArea },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default VacantCommercialPremisesFloorAreaContainer;
