import { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

import {
  isStepRevertAttemptedAction,
  stepRevertConfirmationResolved,
  stepRevertConfirmed,
} from "../actions/actionsUtils";
import { ProjectCreationStep } from "../createProject.reducer";
import { selectShouldConfirmStepRevert } from "../createProject.selectors";

export const setupProjectCreationListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    predicate: isStepRevertAttemptedAction,
    effect: async (_action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      const currentStep = listenerApi
        .getState()
        .projectCreation.stepsHistory.at(-1) as ProjectCreationStep;

      if (!selectShouldConfirmStepRevert(listenerApi.getState())) {
        listenerApi.dispatch(stepRevertConfirmed({ revertedStep: currentStep }));
        return;
      }

      const [confirmationAction] = await listenerApi.take((action) =>
        stepRevertConfirmationResolved.match(action),
      );

      if (confirmationAction.payload.confirmed) {
        listenerApi.dispatch(stepRevertConfirmed({ revertedStep: currentStep }));
      }
    },
  });
};
