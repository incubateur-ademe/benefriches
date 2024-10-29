import {
  completeNonSuitableSoilsSurfaceStep,
  revertNonSuitableSoilsSurfaceStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import {
  selectMissingSuitableSurfaceAreaForPhotovoltaicPanels,
  selectNonSuitableSoilsForPhototovoltaicPanelsToTransform,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import NonSuitableSoilsSurfaceForm, { FormValues } from "./NonSuitableSoilsSurfaceToTransformForm";

function NonSuitableSoilsSurfaceFormContainer() {
  const dispatch = useAppDispatch();
  const nonSuitableSoils = useAppSelector(selectNonSuitableSoilsForPhototovoltaicPanelsToTransform);
  const missingSuitableSurfaceArea = useAppSelector(
    selectMissingSuitableSurfaceAreaForPhotovoltaicPanels,
  );

  return (
    <NonSuitableSoilsSurfaceForm
      soilsToTransform={nonSuitableSoils}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(completeNonSuitableSoilsSurfaceStep(data.soilsTransformation));
      }}
      onBack={() => {
        dispatch(revertNonSuitableSoilsSurfaceStep());
      }}
    />
  );
}

export default NonSuitableSoilsSurfaceFormContainer;
