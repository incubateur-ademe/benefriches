import { appSettingUpdated } from "@/features/app-settings/core/appSettings";
import type { AppDispatch } from "@/shared/core/store-config/store";

export const impactsOnboardingCompleted = () => (dispatch: AppDispatch) => {
  dispatch(
    appSettingUpdated({
      field: "impactsOnboardingLastSeenAt",
      value: new Date().toISOString(),
    }),
  );
};
