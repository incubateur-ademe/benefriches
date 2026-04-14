import { describe, expect, it } from "vitest";

import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import {
  getBuildingsFootprintToConstruct,
  getBuildingsFootprintToDemolish,
  getBuildingsFootprintToReuse,
  getProjectBuildingsFootprint,
  getSiteBuildingsFootprint,
  hasBothReuseAndNewConstruction,
  siteHasBuildings,
  shouldRouteToNewBuildingsUsesFloorSurfaceArea,
  willConstructNewBuildings,
  willDemolishBuildings,
  willReuseExistingBuildings,
} from "../buildingsReaders";

type SiteData = NonNullable<ProjectFormState["siteData"]>;
type StepsState = ProjectFormState["urbanProject"]["steps"];

const makeSiteData = (soilsDistribution: Partial<Record<string, number>>): SiteData =>
  ({ soilsDistribution }) as SiteData;

describe("siteHasBuildings", () => {
  it("returns true when site has BUILDINGS in soilsDistribution", () => {
    const siteData = makeSiteData({ BUILDINGS: 2000 });
    expect(siteHasBuildings(siteData)).toBe(true);
  });

  it("returns false when site has no BUILDINGS", () => {
    const siteData = makeSiteData({ IMPERMEABLE_SOILS: 1000 });
    expect(siteHasBuildings(siteData)).toBe(false);
  });

  it("returns false when BUILDINGS is 0", () => {
    const siteData = makeSiteData({ BUILDINGS: 0 });
    expect(siteHasBuildings(siteData)).toBe(false);
  });
});

describe("getSiteBuildingsFootprint", () => {
  it("returns BUILDINGS surface area from site", () => {
    const siteData = makeSiteData({ BUILDINGS: 2000 });
    expect(getSiteBuildingsFootprint(siteData)).toBe(2000);
  });

  it("returns 0 when site has no BUILDINGS", () => {
    const siteData = makeSiteData({ IMPERMEABLE_SOILS: 1000 });
    expect(getSiteBuildingsFootprint(siteData)).toBe(0);
  });
});

describe("getProjectBuildingsFootprint", () => {
  it("returns BUILDINGS from spaces step", () => {
    const stepsState: StepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
      },
    };
    expect(getProjectBuildingsFootprint(stepsState)).toBe(3000);
  });

  it("returns 0 when spaces step has no BUILDINGS", () => {
    const stepsState: StepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { IMPERMEABLE_SOILS: 1000 } },
      },
    };
    expect(getProjectBuildingsFootprint(stepsState)).toBe(0);
  });
});

describe("getBuildingsFootprintToReuse", () => {
  it("returns reuse value when step is completed", () => {
    const stepsState = {
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 1500 },
      },
    } as StepsState;
    expect(getBuildingsFootprintToReuse(stepsState)).toBe(1500);
  });

  it("returns undefined when step is not completed", () => {
    const stepsState: StepsState = {};
    expect(getBuildingsFootprintToReuse(stepsState)).toBeUndefined();
  });
});

describe("getBuildingsFootprintToDemolish", () => {
  it("returns site buildings minus reuse", () => {
    const siteData = makeSiteData({ BUILDINGS: 2000 });
    const stepsState = {
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 1500 },
      },
    } as StepsState;
    expect(getBuildingsFootprintToDemolish(siteData, stepsState)).toBe(500);
  });
});

describe("getBuildingsFootprintToConstruct", () => {
  it("returns project buildings minus reuse", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 2000 },
      },
    } as StepsState;
    expect(getBuildingsFootprintToConstruct(stepsState)).toBe(1000);
  });

  it("returns 0 when reuse exceeds project buildings", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 3000 },
      },
    } as StepsState;
    expect(getBuildingsFootprintToConstruct(stepsState)).toBe(0);
  });
});

describe("willDemolishBuildings", () => {
  it("returns true when demolished area > 0", () => {
    const siteData = makeSiteData({ BUILDINGS: 2000 });
    const stepsState = {
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 1500 },
      },
    } as StepsState;
    expect(willDemolishBuildings(siteData, stepsState)).toBe(true);
  });

  it("returns false when all buildings are reused", () => {
    const siteData = makeSiteData({ BUILDINGS: 2000 });
    const stepsState = {
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 2000 },
      },
    } as StepsState;
    expect(willDemolishBuildings(siteData, stepsState)).toBe(false);
  });
});

describe("willConstructNewBuildings", () => {
  it("returns true when new construction > 0", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 2000 },
      },
    } as StepsState;
    expect(willConstructNewBuildings(stepsState)).toBe(true);
  });

  it("returns false when no new construction needed", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 2000 },
      },
    } as StepsState;
    expect(willConstructNewBuildings(stepsState)).toBe(false);
  });
});

describe("willReuseExistingBuildings", () => {
  it("returns true when reuse is greater than 0", () => {
    const stepsState = {
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 1200 },
      },
    } as StepsState;

    expect(willReuseExistingBuildings(stepsState)).toBe(true);
  });

  it("returns false when reuse is 0", () => {
    const stepsState = {
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 0 },
      },
    } as StepsState;

    expect(willReuseExistingBuildings(stepsState)).toBe(false);
  });

  it("returns false when reuse step is missing", () => {
    expect(willReuseExistingBuildings({} as StepsState)).toBe(false);
  });
});

describe("hasBothReuseAndNewConstruction", () => {
  it("returns true when reuse > 0 and new construction > 0", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 1000 },
      },
    } as StepsState;
    expect(hasBothReuseAndNewConstruction(stepsState)).toBe(true);
  });

  it("returns false when reuse is 0", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 0 },
      },
    } as StepsState;
    expect(hasBothReuseAndNewConstruction(stepsState)).toBe(false);
  });

  it("returns false when no new construction", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 2000 },
      },
    } as StepsState;
    expect(hasBothReuseAndNewConstruction(stepsState)).toBe(false);
  });
});

describe("shouldRouteToNewBuildingsUsesFloorSurfaceArea", () => {
  it("returns true when new construction remains and the new buildings step already exists", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 0 },
      },
      URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: false,
      },
    } as StepsState;

    expect(shouldRouteToNewBuildingsUsesFloorSurfaceArea(stepsState)).toBe(true);
  });

  it("returns false when reuse is 0 and the new buildings step does not already exist", () => {
    const stepsState = {
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 0 },
      },
    } as StepsState;

    expect(shouldRouteToNewBuildingsUsesFloorSurfaceArea(stepsState)).toBe(false);
  });
});
