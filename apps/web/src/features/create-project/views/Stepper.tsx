import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

type Props = {
  isExtended?: boolean;
};

function ProjectCreationStepper({ isExtended }: Props) {
  return (
    <FormStepper
      currentStepIndex={0}
      steps={["Type de projet"]}
      isExtended={isExtended}
      isDone={false}
    />
  );
}

export default ProjectCreationStepper;
