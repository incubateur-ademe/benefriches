import { AppStartListening } from "@/app/application/listenerMiddleware";

import { appSettingUpdated } from "./appSettings";

export const setupAppSettingsListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: appSettingUpdated,
    effect: (_action, listenerApi) => {
      const state = listenerApi.getState();
      const { appSettingsService } = listenerApi.extra;

      appSettingsService.persist(state.appSettings);
    },
  });
};
