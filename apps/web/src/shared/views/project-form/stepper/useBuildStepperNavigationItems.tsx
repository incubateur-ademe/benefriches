import { useMemo } from "react";
import { typedObjectEntries } from "shared";

import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { StepVariant } from "../../layout/WizardFormLayout/FormStepperStep";
import { ProjectStepGroups, STEP_GROUP_LABELS, STEP_TO_GROUP_MAPPING } from "./stepperConfig";

type ComputeGroupVariantProps = {
  isCompleted: boolean;
  isCurrentGroup: boolean;
  currentHasSubGroup: boolean;
};
const computeGroupVariant = ({
  isCompleted,
  isCurrentGroup,
  currentHasSubGroup,
}: ComputeGroupVariantProps): StepVariant => {
  if (isCurrentGroup) {
    return currentHasSubGroup ? "active" : "current";
  }
  return isCompleted ? "completed" : "empty";
};

type ComputeSubGroupVariantProps = { isCompleted: boolean; isCurrent: boolean };
const computeSubGroupVariant = ({
  isCompleted,
  isCurrent,
}: ComputeSubGroupVariantProps): StepVariant => {
  if (isCurrent) {
    return "current";
  }
  return isCompleted ? "completed" : "empty";
};

export const useBuildStepperNavigationItems = (
  projectStepGroups: ProjectStepGroups,
  currentStep: UrbanProjectCreationStep,
) => {
  return useMemo(() => {
    const { groupId: currentGroupId, subGroupId: currentSubGroupId } =
      STEP_TO_GROUP_MAPPING[currentStep];

    return typedObjectEntries(projectStepGroups).map(([groupId, subGroups]) => {
      const isGroupCompleted = subGroups.every(({ isStepCompleted }) => isStepCompleted);
      const isCurrentGroup = currentGroupId === groupId;

      return {
        groupId,
        title: STEP_GROUP_LABELS[groupId],
        variant: computeGroupVariant({
          isCompleted: isGroupCompleted,
          isCurrentGroup,
          currentHasSubGroup: currentGroupId !== undefined,
        }),
        subGroups: subGroups
          .filter(
            (item): item is typeof item & { subGroupId: NonNullable<typeof item.subGroupId> } =>
              Boolean(item.subGroupId),
          )
          .map(({ stepId, subGroupId, isStepCompleted }) => {
            return {
              targetStepId: stepId,
              variant: computeSubGroupVariant({
                isCurrent: currentGroupId === groupId && currentSubGroupId === subGroupId,
                isCompleted: isStepCompleted,
              }),
              subGroupId,
              title: STEP_GROUP_LABELS[subGroupId],
            };
          }),
      };
    }, []);
  }, [projectStepGroups, currentStep]);
};
