import { describe, expect, it } from "vitest";

import type { UrbanZoneStepContext } from "../../step-handlers/stepHandler.type";
import type { UrbanZoneStepsState } from "../../urbanZoneSteps";
import {
  getFullTimeJobs,
  getManagerName,
  getManagerStructureType,
  getVacantPremisesFloorArea,
  getVacantPremisesFootprintSurfaceArea,
  hasVacantPremises,
  isActivityParkManager,
  isLocalAuthority,
} from "./managementReaders";

const makeContext = (
  stepsState: UrbanZoneStepsState,
  surfaceArea?: number,
): UrbanZoneStepContext => ({
  siteData: { surfaceArea } as UrbanZoneStepContext["siteData"],
  stepsState,
});

describe("getManagerStructureType", () => {
  it("returns undefined when manager step not completed", () => {
    const steps: UrbanZoneStepsState = {};
    expect(getManagerStructureType(steps)).toBeUndefined();
  });

  it("returns 'activity_park_manager' when selected", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: { structureType: "activity_park_manager" },
      },
    };
    expect(getManagerStructureType(steps)).toBe("activity_park_manager");
  });

  it("returns 'local_authority' when selected", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: {
          structureType: "local_authority",
          localAuthority: "municipality",
          localAuthorityName: "Mairie",
        },
      },
    };
    expect(getManagerStructureType(steps)).toBe("local_authority");
  });
});

describe("getManagerName", () => {
  it("returns undefined when manager step not completed", () => {
    const steps: UrbanZoneStepsState = {};
    expect(getManagerName(steps)).toBeUndefined();
  });

  it("returns undefined when manager is activity_park_manager", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: { structureType: "activity_park_manager" },
      },
    };
    expect(getManagerName(steps)).toBeUndefined();
  });

  it("returns local authority name when manager is local_authority", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: {
          structureType: "local_authority",
          localAuthority: "municipality",
          localAuthorityName: "Mairie de Paris",
        },
      },
    };
    expect(getManagerName(steps)).toBe("Mairie de Paris");
  });
});

describe("getVacantPremisesFootprintSurfaceArea", () => {
  it("returns undefined when step not completed", () => {
    const steps: UrbanZoneStepsState = {};
    expect(getVacantPremisesFootprintSurfaceArea(steps)).toBeUndefined();
  });

  it("returns surface area when step completed", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
        completed: true,
        payload: { surfaceArea: 500 },
      },
    };
    expect(getVacantPremisesFootprintSurfaceArea(steps)).toBe(500);
  });
});

describe("getVacantPremisesFloorArea", () => {
  it("returns undefined when step not completed", () => {
    const steps: UrbanZoneStepsState = {};
    expect(getVacantPremisesFloorArea(steps)).toBeUndefined();
  });

  it("returns surface area when step completed", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: {
        completed: true,
        payload: { surfaceArea: 1200 },
      },
    };
    expect(getVacantPremisesFloorArea(steps)).toBe(1200);
  });
});

describe("getFullTimeJobs", () => {
  it("returns undefined when step not completed", () => {
    const steps: UrbanZoneStepsState = {};
    expect(getFullTimeJobs(steps)).toBeUndefined();
  });

  it("returns full time jobs when step completed", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: {
        completed: true,
        payload: { fullTimeJobs: 42 },
      },
    };
    expect(getFullTimeJobs(steps)).toBe(42);
  });
});

describe("isActivityParkManager", () => {
  it("returns false when manager step not completed", () => {
    expect(isActivityParkManager(makeContext({}))).toBe(false);
  });

  it("returns true when manager is activity_park_manager", () => {
    const context = makeContext({
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: { structureType: "activity_park_manager" },
      },
    });
    expect(isActivityParkManager(context)).toBe(true);
  });

  it("returns false when manager is local_authority", () => {
    const context = makeContext({
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: {
          structureType: "local_authority",
          localAuthority: "municipality",
          localAuthorityName: "Mairie",
        },
      },
    });
    expect(isActivityParkManager(context)).toBe(false);
  });
});

describe("isLocalAuthority", () => {
  it("returns false when manager step not completed", () => {
    expect(isLocalAuthority(makeContext({}))).toBe(false);
  });

  it("returns true when manager is local_authority", () => {
    const context = makeContext({
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: {
          structureType: "local_authority",
          localAuthority: "municipality",
          localAuthorityName: "Mairie",
        },
      },
    });
    expect(isLocalAuthority(context)).toBe(true);
  });

  it("returns false when manager is activity_park_manager", () => {
    const context = makeContext({
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: { structureType: "activity_park_manager" },
      },
    });
    expect(isLocalAuthority(context)).toBe(false);
  });
});

describe("hasVacantPremises", () => {
  it("returns false when footprint step not completed", () => {
    expect(hasVacantPremises(makeContext({}))).toBe(false);
  });

  it("returns false when footprint is 0", () => {
    const context = makeContext({
      URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
        completed: true,
        payload: { surfaceArea: 0 },
      },
    });
    expect(hasVacantPremises(context)).toBe(false);
  });

  it("returns true when footprint is greater than 0", () => {
    const context = makeContext({
      URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
        completed: true,
        payload: { surfaceArea: 500 },
      },
    });
    expect(hasVacantPremises(context)).toBe(true);
  });
});
