import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectNameAndDescriptionInitialValues } from "@/features/create-project/core/renewable-energy/step-handlers/naming/naming.selector";
import ProjectNameAndDescriptionForm, {
  FormValues,
} from "@/shared/views/project-form/common/name-and-description/ProjectNameAndDescriptionForm";

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectNameAndDescriptionInitialValues);

  return (
    <ProjectNameAndDescriptionForm
      initialValues={initialValues}
      onSubmit={(formData: FormValues) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_NAMING",
            answers: formData,
          }),
        );
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
