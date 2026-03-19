import type { SoilsDistribution } from "shared";
import { describe, expect, it } from "vitest";

import type { UrbanZoneStepsState } from "../../urbanZoneSteps";
import { aggregateSoilsDistribution } from "./soilsReaders";

describe("aggregateSoilsDistribution", () => {
  it("returns empty distribution when no parcels are selected", () => {
    const steps: UrbanZoneStepsState = {};
    const result = aggregateSoilsDistribution(steps);
    expect(result).toEqual({});
  });

  it("returns empty distribution when parcels selected but no soils data", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_LAND_PARCELS_SELECTION: {
        completed: true,
        payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] },
      },
    };
    const result = aggregateSoilsDistribution(steps);
    expect(result).toEqual({});
  });

  it("returns soils from a single parcel type", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_LAND_PARCELS_SELECTION: {
        completed: true,
        payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] },
      },
      URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
        completed: true,
        payload: {
          soilsDistribution: { BUILDINGS: 100, IMPERMEABLE_SOILS: 200 },
        },
      },
    };
    const result = aggregateSoilsDistribution(steps);
    expect(result).toEqual({ BUILDINGS: 100, IMPERMEABLE_SOILS: 200 });
  });

  it("aggregates soils across multiple parcel types", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_LAND_PARCELS_SELECTION: {
        completed: true,
        payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] },
      },
      URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
        completed: true,
        payload: {
          soilsDistribution: { BUILDINGS: 100, IMPERMEABLE_SOILS: 200 },
        },
      },
      URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: {
        completed: true,
        payload: {
          soilsDistribution: { BUILDINGS: 50, MINERAL_SOIL: 300 },
        },
      },
    };
    const result = aggregateSoilsDistribution(steps);
    const expected: SoilsDistribution = {
      BUILDINGS: 150,
      IMPERMEABLE_SOILS: 200,
      MINERAL_SOIL: 300,
    };
    expect(result).toEqual(expected);
  });
});
