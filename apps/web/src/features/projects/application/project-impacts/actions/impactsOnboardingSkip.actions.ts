import type { AppDispatch } from "@/app/store/store";
import { appSettingUpdated } from "@/features/app-settings/core/appSettings";

export const impactsOnboardingCompleted = () => (dispatch: AppDispatch) => {
  dispatch(
    appSettingUpdated({
      field: "impactsOnboardingLastSeenAt",
      value: new Date().toISOString(),
    }),
  );
};
