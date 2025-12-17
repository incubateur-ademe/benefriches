import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import type { RootState } from "@/shared/core/store-config/store";

import { canSkipImpactsOnboarding } from "./impactsOnboardingSkip";

export const selectCanSkipImpactsOnboarding = (state: RootState): boolean => {
  const { impactsOnboardingLastSeenAt } = selectAppSettings(state);
  const lastSeenDate = impactsOnboardingLastSeenAt ? new Date(impactsOnboardingLastSeenAt) : null;
  return canSkipImpactsOnboarding(lastSeenDate, new Date());
};
