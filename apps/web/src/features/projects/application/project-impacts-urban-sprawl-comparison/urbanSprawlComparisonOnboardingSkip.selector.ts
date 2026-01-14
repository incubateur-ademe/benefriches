import { isSameDay } from "date-fns";

import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import type { RootState } from "@/shared/core/store-config/store";

export const selectDisplayOnboarding = (state: RootState): boolean => {
  const { urbanSprawlComparisonOnboardingLastSeenAt } = selectAppSettings(state);
  if (urbanSprawlComparisonOnboardingLastSeenAt) {
    return !isSameDay(new Date(urbanSprawlComparisonOnboardingLastSeenAt), new Date());
  }
  return true;
};
