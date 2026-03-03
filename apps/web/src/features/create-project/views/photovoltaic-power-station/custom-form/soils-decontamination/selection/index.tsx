import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectSoilsDecontaminationSelectionViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-decontamination/soils-decontamination-selection/soilsDecontaminationSelection.selectors";
import SoilsDecontaminationSelection, {
  FormValues,
} from "@/shared/views/project-form/common/soils-decontamination/selection/SoilsDecontaminationSelection";

function SoilsDecontaminationSelectionContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectSoilsDecontaminationSelectionViewData);

  return (
    <SoilsDecontaminationSelection
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: data.decontaminationSelection ?? "unknown" },
          }),
        );
      }}
      onBack={() => dispatch(navigateToPrevious())}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;
