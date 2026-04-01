import { useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";
import StepperLiItem from "@/shared/views/project-form/stepper/StepperItem";
import { STEP_TO_GROUP_MAPPING } from "@/shared/views/project-form/stepper/stepperConfig";
import { useBuildStepperNavigationItems } from "@/shared/views/project-form/stepper/useBuildStepperNavigationItems";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import { selectUrbanProjectCreationStepperDataView } from "../../core/urban-project/urbanProject.selectors";

function UrbanProjectCreationStepperSteps() {
  const { selectUrbanProjectCreationStepperViewData, onNavigateToStep, onNavigateToStepperGroup } =
    useProjectForm();

  const { stepsGroupedBySections, nextEmptyStep, saveState } = useAppSelector(
    selectUrbanProjectCreationStepperViewData,
  );

  const { currentStep, currentProjectFlow } = useAppSelector(
    selectUrbanProjectCreationStepperDataView,
  );

  const stepGroupsList = useBuildStepperNavigationItems({
    projectStepGroups: stepsGroupedBySections,
    currentStep,
    disableCurrent: currentProjectFlow !== "URBAN_PROJECT",
  });

  const { groupId: nextEmptyStepGroupId, subGroupId: nextEmptyStepSubGroupId } = nextEmptyStep
    ? STEP_TO_GROUP_MAPPING[nextEmptyStep]
    : {};

  const isFormDisabled = saveState === "success";

  return stepGroupsList.map(({ title, groupId, subGroups, variant }) => (
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
  ));
}

export default UrbanProjectCreationStepperSteps;
