import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

function ProjectCreationStepper() {
  return <FormStepper currentStepIndex={0} steps={["Type de projet"]} isDone={false} />;
}

export default ProjectCreationStepper;
