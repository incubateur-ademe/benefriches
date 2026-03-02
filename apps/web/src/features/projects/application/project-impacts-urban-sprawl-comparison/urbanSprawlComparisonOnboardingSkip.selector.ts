import { isSameDay } from "date-fns";

import type { RootState } from "@/app/store/store";
import { selectAppSettings } from "@/features/app-settings/core/appSettings";

export const selectDisplayOnboarding = (state: RootState): boolean => {
  const { urbanSprawlComparisonOnboardingLastSeenAt } = selectAppSettings(state);
  if (urbanSprawlComparisonOnboardingLastSeenAt) {
    return !isSameDay(new Date(urbanSprawlComparisonOnboardingLastSeenAt), new Date());
  }
  return true;
};
