import { describe, expect, it } from "vitest";

import type { UrbanZoneStepContext } from "../../step-handlers/stepHandler.type";
import type { UrbanZoneStepsState } from "../../urbanZoneSteps";
import { hasActivity } from "./activityReaders";

const makeContext = (
  stepsState: UrbanZoneStepsState,
  surfaceArea?: number,
): UrbanZoneStepContext => ({
  siteData: { surfaceArea } as UrbanZoneStepContext["siteData"],
  stepsState,
});

describe("hasActivity", () => {
  it("returns false when footprint step not completed", () => {
    expect(hasActivity(makeContext({}, 1000))).toBe(false);
  });

  it("returns true when footprint is less than total surface area", () => {
    const context = makeContext(
      {
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 500 },
        },
      },
      1000,
    );
    expect(hasActivity(context)).toBe(true);
  });

  it("returns false when footprint equals total surface area", () => {
    const context = makeContext(
      {
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 1000 },
        },
      },
      1000,
    );
    expect(hasActivity(context)).toBe(false);
  });

  it("returns false when footprint exceeds total surface area", () => {
    const context = makeContext(
      {
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 1500 },
        },
      },
      1000,
    );
    expect(hasActivity(context)).toBe(false);
  });

  it("returns true when surfaceArea is undefined (uses Infinity fallback)", () => {
    const context = makeContext(
      {
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 500 },
        },
      },
      undefined,
    );
    expect(hasActivity(context)).toBe(true);
  });
});
