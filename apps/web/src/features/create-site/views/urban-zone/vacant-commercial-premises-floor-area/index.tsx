import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectVacantCommercialPremisesFloorAreaViewData } from "@/features/create-site/core/urban-zone/steps/management/vacant-commercial-premises-floor-area/vacantCommercialPremisesFloorArea.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import VacantCommercialPremisesFloorAreaForm from "./VacantCommercialPremisesFloorAreaForm";

function VacantCommercialPremisesFloorAreaContainer() {
  const dispatch = useAppDispatch();
  const { initialValue, vacantPremisesFootprintSurfaceArea } = useAppSelector(
    selectVacantCommercialPremisesFloorAreaViewData,
  );

  return (
    <VacantCommercialPremisesFloorAreaForm
      initialValue={initialValue}
      vacantFootprintSurfaceArea={vacantPremisesFootprintSurfaceArea}
      onSubmit={({ surfaceArea }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
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

export default VacantCommercialPremisesFloorAreaContainer;
