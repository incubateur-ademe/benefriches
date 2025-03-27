import { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

import {
  stepRevertAttempted,
  stepRevertConfirmationResolved,
  stepRevertConfirmed,
} from "../actions/revert.actions";
import { selectShouldConfirmStepRevert } from "../selectors/createSite.selectors";

export const setupSiteCreationListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: stepRevertAttempted,
    effect: async (_action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      if (!selectShouldConfirmStepRevert(listenerApi.getState())) {
        listenerApi.dispatch(stepRevertConfirmed());
        return;
      }

      const [confirmationResolvedAction] = await listenerApi.take((action) =>
        stepRevertConfirmationResolved.match(action),
      );

      if (confirmationResolvedAction.payload.confirmed) {
        listenerApi.dispatch(stepRevertConfirmed());
      }
    },
  });
};
