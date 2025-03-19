import { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

import {
  stepRevertConfirmed,
  stepRevertCancelled,
  isStepRevertAttemptedAction,
  stepReverted,
  StepRevertedActionPayload,
} from "../actions/revert.actions";
import { selectShouldConfirmStepRevert } from "../selectors/createSite.selectors";

export const setupSiteCreationListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    predicate: isStepRevertAttemptedAction,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      if (!selectShouldConfirmStepRevert(listenerApi.getState())) {
        listenerApi.dispatch(stepReverted(action.payload as StepRevertedActionPayload));
        return;
      }

      const [confirmationAction] = await listenerApi.take(
        (action) =>
          action.type === stepRevertConfirmed.type || action.type === stepRevertCancelled.type,
      );

      if (confirmationAction.type === stepRevertConfirmed.type) {
        listenerApi.dispatch(stepReverted(action.payload as StepRevertedActionPayload));
      }
    },
  });
};
