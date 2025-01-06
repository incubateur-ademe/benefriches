import { AppStartListening } from "@/app/application/listenerMiddleware";

import { isAppSettingsUpdateAction } from "./appSettings";

export const setupAppSettingsListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    predicate: (action) => isAppSettingsUpdateAction(action.type),
    effect: (_action, listenerApi) => {
      const state = listenerApi.getState();
      const { appSettingsService } = listenerApi.extra;

      appSettingsService.persist(state.appSettings);
    },
  });
};
