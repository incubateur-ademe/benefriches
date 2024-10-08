import {
  completeNonSuitableSoilsSelectionStep,
  revertNonSuitableSoilsSelectionStep,
} from "@/features/create-project/application/createProject.reducer";
import {
  selectMissingSuitableSurfaceAreaForPhotovoltaicPanels,
  selectNonSuitableSoilsForPhototovoltaicPanels,
} from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import NonSuitableSoilsSelection, { FormValues } from "./NonSuitableSoilsSelection";

function NonSuitableSoilsSelectionContainer() {
  const dispatch = useAppDispatch();
  const nonSuitableSoils = useAppSelector(selectNonSuitableSoilsForPhototovoltaicPanels);
  const missingSuitableSurfaceArea = useAppSelector(
    selectMissingSuitableSurfaceAreaForPhotovoltaicPanels,
  );

  return (
    <NonSuitableSoilsSelection
      nonSuitableSoils={nonSuitableSoils}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(completeNonSuitableSoilsSelectionStep(data.soils));
      }}
      onBack={() => {
        dispatch(revertNonSuitableSoilsSelectionStep());
      }}
    />
  );
}

export default NonSuitableSoilsSelectionContainer;
