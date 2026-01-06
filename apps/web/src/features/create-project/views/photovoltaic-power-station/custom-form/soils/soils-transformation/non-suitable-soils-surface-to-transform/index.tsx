import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeNonSuitableSoilsSurfaceStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectNonSuitableSoilsSurfaceAreaToTransformViewData } from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import NonSuitableSoilsSurfaceForm, { FormValues } from "./NonSuitableSoilsSurfaceToTransformForm";

function NonSuitableSoilsSurfaceFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, soilsToTransform, missingSuitableSurfaceArea } = useAppSelector(
    selectNonSuitableSoilsSurfaceAreaToTransformViewData,
  );

  return (
    <NonSuitableSoilsSurfaceForm
      initialValues={{ soilsTransformation: initialValues }}
      soilsToTransform={soilsToTransform}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(completeNonSuitableSoilsSurfaceStep(data.soilsTransformation));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default NonSuitableSoilsSurfaceFormContainer;
