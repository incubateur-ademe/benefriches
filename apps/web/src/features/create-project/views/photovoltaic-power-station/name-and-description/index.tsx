import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import ProjectNameAndDescriptionForm, {
  FormValues,
} from "@/features/create-project/views/project-form/common/name-and-description/ProjectNameAndDescriptionForm";

function ProjectNameAndDescriptionFormContainer() {
  const { onBack, onRequestStepCompletion, selectNameAndDescriptionInitialValues } =
    useRenewableEnergyForm();
  const initialValues = useAppSelector(selectNameAndDescriptionInitialValues);

  return (
    <ProjectNameAndDescriptionForm
      initialValues={initialValues}
      onSubmit={(formData: FormValues) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_NAMING",
          answers: formData,
        });
      }}
      onBack={onBack}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
