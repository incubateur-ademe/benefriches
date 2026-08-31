import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import VacantCommercialPremisesFootprintForm from "./VacantCommercialPremisesFootprintForm";

function VacantCommercialPremisesFootprintContainer() {
  const { onBack, onRequestStepCompletion, selectVacantCommercialPremisesFootprintViewData } =
    useUrbanZoneSiteForm();
  const { initialValue, siteSurfaceArea } = useAppSelector(
    selectVacantCommercialPremisesFootprintViewData,
  );

  return (
    <VacantCommercialPremisesFootprintForm
      initialValue={initialValue}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={({ surfaceArea }) => {
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
          answers: { surfaceArea },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default VacantCommercialPremisesFootprintContainer;
