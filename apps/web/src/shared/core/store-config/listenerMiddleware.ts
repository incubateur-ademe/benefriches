import {
  createListenerMiddleware,
  Dispatch,
  ListenerMiddlewareInstance,
  TypedStartListening,
} from "@reduxjs/toolkit";

import { setupAppSettingsListeners } from "@/features/app-settings/core/appSettingsListeners";
import { setupSiteCreationListeners } from "@/features/create-site/core/listeners/siteCreationListeners";

import { rootReducer } from "./rootReducer";
import { AppDependencies, AppDispatch, RootState } from "./store";

type AppListenerMiddlewareInstance = ListenerMiddlewareInstance<
  ReturnType<typeof rootReducer>,
  Dispatch,
  AppDependencies
>;

export const getListener = (appDependencies: AppDependencies): AppListenerMiddlewareInstance => {
  return createListenerMiddleware({
    extra: appDependencies,
  });
};

export type AppStartListening = TypedStartListening<RootState, AppDispatch, AppDependencies>;

export function setupAllListeners(startAppListening: AppStartListening) {
  setupAppSettingsListeners(startAppListening);
  setupSiteCreationListeners(startAppListening);
}
