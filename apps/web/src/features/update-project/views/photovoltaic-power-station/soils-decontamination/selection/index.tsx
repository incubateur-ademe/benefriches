import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectSoilsDecontaminationSelectionViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";
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
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: data.decontaminationSelection ?? "unknown" },
          }),
        );
      }}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;
