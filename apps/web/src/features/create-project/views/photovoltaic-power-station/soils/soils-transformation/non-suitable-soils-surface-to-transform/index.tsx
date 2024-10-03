import NonSuitableSoilsSurfaceForm, { FormValues } from "./NonSuitableSoilsSurfaceToTransformForm";

import {
  completeNonSuitableSoilsSurfaceStep,
  revertNonSuitableSoilsSurfaceStep,
} from "@/features/create-project/application/createProject.reducer";
import {
  selectMissingSuitableSurfaceAreaForPhotovoltaicPanels,
  selectNonSuitableSoilsForPhototovoltaicPanelsToTransform,
} from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
