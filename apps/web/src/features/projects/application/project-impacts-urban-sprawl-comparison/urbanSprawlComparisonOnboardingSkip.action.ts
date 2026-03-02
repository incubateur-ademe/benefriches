import type { AppDispatch } from "@/app/store/store";
import { appSettingUpdated } from "@/features/app-settings/core/appSettings";

export const urbanSprawlComparisonOnboardingCompleted = () => (dispatch: AppDispatch) => {
  dispatch(
    appSettingUpdated({
      field: "urbanSprawlComparisonOnboardingLastSeenAt",
      value: new Date().toISOString(),
    }),
  );
};
