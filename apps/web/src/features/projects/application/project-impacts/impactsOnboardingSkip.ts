import { differenceInDays, isSameDay } from "date-fns";

const MAX_DAYS_BEFORE_SKIP = 30;

export const canSkipImpactsOnboarding = (lastSeenAt: Date | null, now: Date): boolean => {
  if (lastSeenAt === null) {
    return false;
  }

  const daysSinceLastSeen = differenceInDays(now, lastSeenAt);
  return daysSinceLastSeen <= MAX_DAYS_BEFORE_SKIP;
};

export const hasSeenOnboardingToday = (lastSeenAt: Date | null, now: Date): boolean => {
  if (lastSeenAt === null) {
    return false;
  }
  return isSameDay(lastSeenAt, now);
};
