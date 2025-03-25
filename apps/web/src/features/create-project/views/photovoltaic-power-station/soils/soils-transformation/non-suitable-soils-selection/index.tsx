import { completeNonSuitableSoilsSelectionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { nonSuitableSoilsSelectionStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { selectNonSuitableSelectionViewData } from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import NonSuitableSoilsSelection, { FormValues } from "./NonSuitableSoilsSelection";

function NonSuitableSoilsSelectionContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, nonSuitableSoils, missingSuitableSurfaceArea } = useAppSelector(
    selectNonSuitableSelectionViewData,
  );

  return (
    <NonSuitableSoilsSelection
      initialValues={initialValues}
      nonSuitableSoils={nonSuitableSoils}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(completeNonSuitableSoilsSelectionStep(data.soils));
      }}
      onBack={() => {
        dispatch(nonSuitableSoilsSelectionStepReverted());
      }}
    />
  );
}

export default NonSuitableSoilsSelectionContainer;
