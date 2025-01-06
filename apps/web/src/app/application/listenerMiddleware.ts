import {
  createListenerMiddleware,
  Dispatch,
  ListenerMiddlewareInstance,
  TypedStartListening,
} from "@reduxjs/toolkit";

import { setupAppSettingsListeners } from "@/shared/app-settings/core/appSettingsListeners";

import { rootReducer } from "./rootReducer";
import { AppDependencies, RootState } from "./store";

export type AppListenerMiddlewareInstance = ListenerMiddlewareInstance<
  ReturnType<typeof rootReducer>,
  Dispatch,
  AppDependencies
>;

export const getListener = (appDependencies: AppDependencies): AppListenerMiddlewareInstance => {
  return createListenerMiddleware<RootState, Dispatch, AppDependencies>({
    extra: appDependencies,
  });
};

export type AppStartListening = TypedStartListening<RootState, Dispatch, AppDependencies>;

export function setupAllListeners(startAppListening: AppStartListening) {
  setupAppSettingsListeners(startAppListening);
}
