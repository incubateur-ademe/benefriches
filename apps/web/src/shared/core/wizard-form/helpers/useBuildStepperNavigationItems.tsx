import { useMemo } from "react";
import { typedObjectEntries } from "shared";

import type { StepVariant } from "@/shared/core/stepVariant.types";

import { StepGroups, StepToGroupMapping } from "./stepGroups";

type UseBuildStepperNavigationItemsProps<
  TStepId extends string,
  TGroupId extends string,
  TSubGroupId extends string,
> = {
  stepGroups: StepGroups<TStepId, TGroupId, TSubGroupId>;
  currentStep: TStepId;
  stepToGroupMapping: StepToGroupMapping<TStepId, TGroupId, TSubGroupId>;
  labels: Record<TGroupId | TSubGroupId, string>;
  disableCurrent?: boolean;
};

export const useBuildStepperNavigationItems = <
  TStepId extends string,
  TGroupId extends string,
  TSubGroupId extends string,
>({
  stepGroups,
  currentStep,
  stepToGroupMapping,
  labels,
  disableCurrent,
}: UseBuildStepperNavigationItemsProps<TStepId, TGroupId, TSubGroupId>) => {
  return useMemo(() => {
    const { groupId: currentGroupId, subGroupId: currentSubGroupId } =
      stepToGroupMapping[currentStep];

    return typedObjectEntries(stepGroups).map(([groupId, subGroups]) => {
      const isGroupCompleted = subGroups.every(({ isStepCompleted }) => isStepCompleted);
      const isCurrentGroup = disableCurrent === true ? false : currentGroupId === groupId;

      return {
        groupId,
        title: labels[groupId],
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
              title: labels[subGroupId],
            };
          }),
      };
    }, []);
  }, [stepGroups, currentStep, stepToGroupMapping, labels, disableCurrent]);
};
