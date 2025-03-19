import { Action } from "@reduxjs/toolkit";

import {
  stepRevertCancelled,
  stepRevertConfirmed,
} from "@/features/create-site/core/actions/revert.actions";
import { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

import { appSettingUpdated } from "./appSettings";

const stepRevertConfirmationActions = [stepRevertConfirmed, stepRevertCancelled] as const;
type FormStepRevertConfirmationAction = ReturnType<(typeof stepRevertConfirmationActions)[number]>;
const isFormStepRevertConfirmationAction = (
  action: Action,
): action is FormStepRevertConfirmationAction =>
  stepRevertConfirmationActions.some((a) => a.match(action));

export const setupAppSettingsListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: appSettingUpdated,
    effect: (_action, listenerApi) => {
      const state = listenerApi.getState();
      const { appSettingsService } = listenerApi.extra;

      appSettingsService.persist(state.appSettings);
    },
  });
  startAppListening({
    predicate: isFormStepRevertConfirmationAction,
    effect: (action, listenerApi) => {
      if (action.payload.doNotAskAgain) {
        listenerApi.dispatch(
          appSettingUpdated({
            field: "askForConfirmationOnStepRevert",
            value: false,
          }),
        );
      }
    },
  });
};
