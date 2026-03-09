import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectLandParcelsSelectionViewData } from "@/features/create-site/core/urban-zone/steps/land-parcels/land-parcels-selection/landParcelsSelection.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import LandParcelsSelectionForm, { type FormValues } from "./LandParcelsSelectionForm";

function LandParcelsSelectionContainer() {
  const dispatch = useAppDispatch();
  const { initialSelectedTypes } = useAppSelector(selectLandParcelsSelectionViewData);

  return (
    <LandParcelsSelectionForm
      initialValues={{ landParcelTypes: initialSelectedTypes }}
      onSubmit={(data: FormValues) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
            answers: { landParcelTypes: data.landParcelTypes },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default LandParcelsSelectionContainer;
