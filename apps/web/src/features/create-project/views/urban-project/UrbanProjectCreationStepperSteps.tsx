import { useAppSelector } from "@/app/hooks/store.hooks";
import {
  STEP_GROUP_LABELS,
  STEP_TO_GROUP_MAPPING,
} from "@/features/create-project/core/urban-project/stepperConfig";
import StepperLiItem from "@/features/create-project/views/project-form/stepper/StepperItem";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";
import { useBuildStepperNavigationItems } from "@/shared/core/wizard-form/helpers/useBuildStepperNavigationItems";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

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
    stepGroups: stepsGroupedBySections,
    currentStep,
    stepToGroupMapping: STEP_TO_GROUP_MAPPING,
    labels: STEP_GROUP_LABELS,
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
