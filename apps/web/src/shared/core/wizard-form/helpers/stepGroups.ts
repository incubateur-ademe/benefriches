export type StepStepperConfig<TGroupId extends string, TSubGroupId extends string> = {
  groupId: TGroupId;
  subGroupId?: TSubGroupId;
};

export type StepToGroupMapping<
  TStepId extends string,
  TGroupId extends string,
  TSubGroupId extends string,
> = Record<TStepId, StepStepperConfig<TGroupId, TSubGroupId>>;

export type StepGroups<
  TStepId extends string,
  TGroupId extends string,
  TSubGroupId extends string,
> = Record<
  TGroupId,
  {
    stepId: TStepId;
    subGroupId?: TSubGroupId;
    isStepCompleted: boolean;
  }[]
>;

/**
 * Buckets a resolved step sequence (with per-step completion already computed) into its
 * groups/sub-groups, using the given step-to-group mapping. Steps for which `isNavigableStep`
 * returns false (notices, introductions, anything without an answer) are filtered out before
 * bucketing.
 */
export const buildStepGroupsFromSequence = <
  TStepId extends string,
  TGroupId extends string,
  TSubGroupId extends string,
>(
  stepSequence: { stepId: TStepId; isCompleted: boolean }[],
  stepToGroupMapping: StepToGroupMapping<TStepId, TGroupId, TSubGroupId>,
  isNavigableStep: (stepId: TStepId) => boolean,
): StepGroups<TStepId, TGroupId, TSubGroupId> => {
  const stepGroups = {} as StepGroups<TStepId, TGroupId, TSubGroupId>;

  for (const { stepId, isCompleted: isStepCompleted } of stepSequence.filter(({ stepId }) =>
    isNavigableStep(stepId),
  )) {
    const { groupId, subGroupId } = stepToGroupMapping[stepId];

    if (!stepGroups[groupId]) {
      stepGroups[groupId] = [];
    }

    stepGroups[groupId].push({
      stepId,
      subGroupId,
      isStepCompleted,
    });
  }

  return stepGroups;
};
