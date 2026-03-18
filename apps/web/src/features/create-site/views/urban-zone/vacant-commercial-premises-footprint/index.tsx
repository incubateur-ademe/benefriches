import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectVacantCommercialPremisesFootprintViewData } from "@/features/create-site/core/urban-zone/steps/management/vacant-commercial-premises-footprint/vacantCommercialPremisesFootprint.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import VacantCommercialPremisesFootprintForm from "./VacantCommercialPremisesFootprintForm";

function VacantCommercialPremisesFootprintContainer() {
  const dispatch = useAppDispatch();
  const { initialValue, siteSurfaceArea } = useAppSelector(
    selectVacantCommercialPremisesFootprintViewData,
  );

  return (
    <VacantCommercialPremisesFootprintForm
      initialValue={initialValue}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={({ surfaceArea }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
            answers: { surfaceArea },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default VacantCommercialPremisesFootprintContainer;
