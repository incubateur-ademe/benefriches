import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import SoilsTransformationProjectForm, {
  FormValues,
} from "@/features/create-project/views/photovoltaic-power-station/soils/soils-transformation/transformation-project-selection/SoilsTransformationProjectForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectSoilsTransformationProjectSelectionViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function SoilsTransformationProjectFormContainer() {
  const { initialValues } = useAppSelector(selectSoilsTransformationProjectSelectionViewData);
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationProjectForm
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
            answers: { soilsTransformationProject: data.soilsTransformationProject },
          }),
        );
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default SoilsTransformationProjectFormContainer;
