import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectSoilsTransformationProjectSelectionViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/soils-transformation-project-selection/soilsTransformationProjectSelection.selectors";

import SoilsTransformationProjectForm, { FormValues } from "./SoilsTransformationProjectForm";

function SoilsTransformationProjectFormContainer() {
  const { initialValues } = useAppSelector(selectSoilsTransformationProjectSelectionViewData);
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationProjectForm
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
            answers: { soilsTransformationProject: data.soilsTransformationProject },
          }),
        );
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default SoilsTransformationProjectFormContainer;
