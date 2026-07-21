import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import ProjectNameAndDescriptionForm, {
  FormValues,
} from "@/features/create-project/views/project-form/common/name-and-description/ProjectNameAndDescriptionForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectNameAndDescriptionInitialValues } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectNameAndDescriptionInitialValues);

  return (
    <ProjectNameAndDescriptionForm
      initialValues={initialValues}
      onSubmit={(formData: FormValues) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_NAMING",
            answers: formData,
          }),
        );
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
