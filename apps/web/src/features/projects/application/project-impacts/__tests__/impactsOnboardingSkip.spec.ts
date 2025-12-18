import { canSkipImpactsOnboarding, hasSeenOnboardingToday } from "../impactsOnboardingSkip";

describe("canSkipImpactsOnboarding", () => {
  const NOW = new Date("2025-01-15T12:00:00Z");

  it("should return false when lastSeenAt is null (first evaluation)", () => {
    expect(canSkipImpactsOnboarding(null, NOW)).toBe(false);
  });

  it("should return false when seen 0 days ago (just seen)", () => {
    expect(canSkipImpactsOnboarding(new Date("2025-01-15T11:50:00Z"), NOW)).toBe(true);
  });

  it("should return false when seen 1 day ago (skippable)", () => {
    expect(canSkipImpactsOnboarding(new Date("2025-01-14T12:00:00Z"), NOW)).toBe(true);
  });

  it("should return true when seen 15 days ago (middle of skippable window)", () => {
    expect(canSkipImpactsOnboarding(new Date("2024-12-31T12:00:00Z"), NOW)).toBe(true);
  });

  it("should return true when seen 30 days ago (edge of skippable window)", () => {
    expect(canSkipImpactsOnboarding(new Date("2024-12-16T12:00:00Z"), NOW)).toBe(true);
  });

  it("should return false when seen 31 days ago (expired)", () => {
    expect(canSkipImpactsOnboarding(new Date("2024-12-15T12:00:00Z"), NOW)).toBe(false);
  });
});

describe("hasSeenOnboardingToday", () => {
  const NOW = new Date("2025-01-15T12:00:00Z");

  it("should return false when lastSeenAt is null", () => {
    expect(hasSeenOnboardingToday(null, NOW)).toBe(false);
  });

  it("should return true when seen earlier today (same calendar day)", () => {
    expect(hasSeenOnboardingToday(new Date("2025-01-15T08:00:00Z"), NOW)).toBe(true);
  });

  it("should return false when seen yesterday", () => {
    expect(hasSeenOnboardingToday(new Date("2025-01-14T00:00:00Z"), NOW)).toBe(false);
  });
});
