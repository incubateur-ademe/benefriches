import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { RootState } from "@/shared/core/store-config/store";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";
import StepperLiItem from "@/shared/views/project-form/stepper/StepperItem";
import { STEP_TO_GROUP_MAPPING } from "@/shared/views/project-form/stepper/stepperConfig";
import { useBuildStepperNavigationItems } from "@/shared/views/project-form/stepper/useBuildStepperNavigationItems";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

type Props = {
  step: UrbanProjectCreationStep;
};

function UrbanProjectCreationStepper({ step: currentStep }: Props) {
  const {
    selectStepsGroupedBySections,
    selectNextEmptyStep,
    onNavigateToStep,
    onNavigateToStepperGroup,
  } = useProjectForm();

  const stepsGroupedBySections = useAppSelector(selectStepsGroupedBySections);
  const nextEmptyStep = useAppSelector(selectNextEmptyStep);

  const saveState = useAppSelector(
    (state: RootState) => state.projectCreation.urbanProject.saveState,
  );

  const stepGroupsList = useBuildStepperNavigationItems(stepsGroupedBySections, currentStep);

  const { groupId: nextEmptyStepGroupId, subGroupId: nextEmptyStepSubGroupId } = nextEmptyStep
    ? STEP_TO_GROUP_MAPPING[nextEmptyStep]
    : {};

  const isFormDisabled = saveState === "success";

  return (
    <FormStepperWrapper>
      <FormStepperStep
        title="Type de projet"
        variant={{ activity: "inactive", validation: "completed" }}
      />
      {stepGroupsList.map(({ title, groupId, subGroups, variant }) => (
        <StepperLiItem
          key={title}
          title={title}
          variant={variant}
          isFormDisabled={isFormDisabled}
          isNextAvailable={nextEmptyStepGroupId === groupId}
          onClick={() => {
            onNavigateToStepperGroup(groupId);
          }}
        >
          {subGroups && (variant.activity === "groupActive" || variant.activity === "current") && (
            <FormStepperWrapper className="my-0">
              {subGroups.map((subStep) => (
                <StepperLiItem
                  key={subStep.title}
                  title={subStep.title}
                  variant={subStep.variant}
                  className="text-xs pl-6"
                  isFormDisabled={isFormDisabled}
                  isNextAvailable={nextEmptyStepSubGroupId === subStep.subGroupId}
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
