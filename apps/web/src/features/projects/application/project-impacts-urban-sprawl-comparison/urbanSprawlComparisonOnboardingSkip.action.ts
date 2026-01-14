import { appSettingUpdated } from "@/features/app-settings/core/appSettings";
import type { AppDispatch } from "@/shared/core/store-config/store";

export const urbanSprawlComparisonOnboardingCompleted = () => (dispatch: AppDispatch) => {
  dispatch(
    appSettingUpdated({
      field: "urbanSprawlComparisonOnboardingLastSeenAt",
      value: new Date().toISOString(),
    }),
  );
};
