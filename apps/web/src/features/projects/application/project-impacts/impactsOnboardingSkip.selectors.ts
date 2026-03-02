import type { RootState } from "@/app/store/store";
import { selectAppSettings } from "@/features/app-settings/core/appSettings";

import { canSkipImpactsOnboarding, hasSeenOnboardingToday } from "./impactsOnboardingSkip";

export const selectCanSkipImpactsOnboarding = (state: RootState): boolean => {
  const { impactsOnboardingLastSeenAt } = selectAppSettings(state);
  const lastSeenDate = impactsOnboardingLastSeenAt ? new Date(impactsOnboardingLastSeenAt) : null;
  return canSkipImpactsOnboarding(lastSeenDate, new Date());
};

export const selectShouldGoThroughOnboarding = (state: RootState): boolean => {
  const { impactsOnboardingLastSeenAt } = selectAppSettings(state);
  const lastSeenDate = impactsOnboardingLastSeenAt ? new Date(impactsOnboardingLastSeenAt) : null;
  return !hasSeenOnboardingToday(lastSeenDate, new Date());
};
