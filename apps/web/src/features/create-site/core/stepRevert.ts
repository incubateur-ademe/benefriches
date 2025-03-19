const CONSECUTIVE_REVERT_CONFIRMATION_THRESHOLD = 2;

export const shouldConfirmStepRevert = (consecutiveRevertCount: number) => {
  return consecutiveRevertCount >= CONSECUTIVE_REVERT_CONFIRMATION_THRESHOLD;
};
