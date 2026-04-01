import { useMemo } from "react";
import { typedObjectEntries } from "shared";

import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { StepVariant } from "../../layout/WizardFormLayout/FormBaseStepperStep";
import { ProjectStepGroups, STEP_GROUP_LABELS, STEP_TO_GROUP_MAPPING } from "./stepperConfig";

type UseBuildStepperNavigationItemsProps = {
  projectStepGroups: ProjectStepGroups;
  currentStep: UrbanProjectCreationStep;
  disableCurrent?: boolean;
};
export const useBuildStepperNavigationItems = ({
  projectStepGroups,
  currentStep,
  disableCurrent,
}: UseBuildStepperNavigationItemsProps) => {
  return useMemo(() => {
    const { groupId: currentGroupId, subGroupId: currentSubGroupId } =
      STEP_TO_GROUP_MAPPING[currentStep];

    return typedObjectEntries(projectStepGroups).map(([groupId, subGroups]) => {
      const isGroupCompleted = subGroups.every(({ isStepCompleted }) => isStepCompleted);
      const isCurrentGroup = disableCurrent === true ? false : currentGroupId === groupId;

      return {
        groupId,
        title: STEP_GROUP_LABELS[groupId],
        variant: {
          activity: isCurrentGroup
            ? currentSubGroupId !== undefined
              ? "groupActive"
              : "current"
            : "inactive",
          validation: isGroupCompleted ? "completed" : "empty",
        } as StepVariant,
        subGroups: subGroups
          .filter(
            (item): item is typeof item & { subGroupId: NonNullable<typeof item.subGroupId> } =>
              Boolean(item.subGroupId),
          )
          .map(({ stepId, subGroupId, isStepCompleted }) => {
            return {
              targetStepId: stepId,
              variant: {
                activity:
                  isCurrentGroup && currentSubGroupId === subGroupId ? "current" : "inactive",
                validation: isStepCompleted ? "completed" : "empty",
              } as StepVariant,
              subGroupId,
              title: STEP_GROUP_LABELS[subGroupId],
            };
          }),
      };
    }, []);
  }, [projectStepGroups, currentStep, disableCurrent]);
};
