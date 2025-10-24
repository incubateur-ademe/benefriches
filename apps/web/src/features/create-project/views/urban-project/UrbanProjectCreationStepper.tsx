import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { RootState } from "@/shared/core/store-config/store";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";
import StepperLiItem from "@/shared/views/project-form/stepper/StepperItem";
import { STEP_LABELS } from "@/shared/views/project-form/stepper/stepperConfig";
import { useMapStepListToCategoryList } from "@/shared/views/project-form/stepper/useMapStepListToCategoryList";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

type Props = {
  step: UrbanProjectCreationStep;
};

function UrbanProjectCreationStepper({ step: currentStep }: Props) {
  const { selectAvailableStepsState, onNavigateToStep } = useProjectForm();
  const availableStepsState = useAppSelector(selectAvailableStepsState);
  const saveState = useAppSelector(
    (state: RootState) => state.projectCreation.urbanProject.saveState,
  );

  const { categories, nextAvailableCategory } = useMapStepListToCategoryList(
    availableStepsState,
    currentStep,
  );

  const isFormDisabled = saveState === "success";

  return (
    <FormStepperWrapper>
      <FormStepperStep title="Type de projet" state="completed" />
      {categories.map(({ targetStepId, labelKey, subCategories, state }) => (
        <StepperLiItem
          key={labelKey}
          title={STEP_LABELS[labelKey]}
          state={state}
          isFormDisabled={isFormDisabled}
          isNextAvailable={nextAvailableCategory?.category === labelKey}
          onClick={() => {
            onNavigateToStep(targetStepId);
          }}
        >
          {subCategories && (state === "active" || state === "current") && (
            <FormStepperWrapper className="my-0">
              {subCategories.map((subStep) => (
                <StepperLiItem
                  key={subStep.labelKey}
                  title={STEP_LABELS[subStep.labelKey]}
                  state={subStep.state}
                  className="pl-6"
                  isFormDisabled={isFormDisabled}
                  isNextAvailable={nextAvailableCategory?.subCategory === subStep.labelKey}
                  onClick={() => {
                    onNavigateToStep(subStep.targetStepId);
                  }}
                />
              ))}
            </FormStepperWrapper>
          )}
        </StepperLiItem>
      ))}
    </FormStepperWrapper>
  );
}

export default UrbanProjectCreationStepper;
