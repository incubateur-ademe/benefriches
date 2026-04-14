import { describe, it, expect } from "vitest";

import type { UpdateProjectView } from "../updateProject.types";
import { convertProjectDataToSteps } from "./convertProjectDataToSteps";

const BASE_PROJECT_DATA: UpdateProjectView["projectData"] = {
  id: "project-1",
  createdBy: "user-1",
  createdAt: "2026-01-01",
  creationMode: "custom",
  name: "Test Project",
  relatedSiteId: "site-1",
  projectPhase: "planning",
  developmentPlan: {
    type: "URBAN_PROJECT",
    developer: { name: "Dev Corp", structureType: "company" },
    costs: [],
    features: {
      buildingsFloorAreaDistribution: { RESIDENTIAL: 1000 },
    },
  },
  soilsDistribution: [],
  yearlyProjectedCosts: [],
  yearlyProjectedRevenues: [],
};

const BASE_SITE_DATA: UpdateProjectView["siteData"] = {
  id: "site-1",
  name: "Test Site",
  nature: "FRICHE",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner" },
  hasContaminatedSoils: false,
  soilsDistribution: {},
  surfaceArea: 5000,
  address: {
    banId: "addr-1",
    city: "Paris",
    cityCode: "75056",
    postCode: "75001",
    streetName: "Rue",
    streetNumber: "1",
    value: "1 Rue, 75001 Paris",
    long: 2.35,
    lat: 48.85,
  },
};

describe("convertProjectDataToSteps - buildings reuse and construction", () => {
  it("should map buildingsFootprintToReuse to step payload", () => {
    const steps = convertProjectDataToSteps({
      projectData: { ...BASE_PROJECT_DATA, buildingsFootprintToReuse: 500 },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE).toEqual({
      payload: { buildingsFootprintToReuse: 500 },
      completed: true,
    });
  });

  it("should not map buildingsFootprintToReuse when absent", () => {
    const steps = convertProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE).toBeUndefined();
  });

  it("should map existingBuildingsUsesFloorSurfaceArea to step payload", () => {
    const steps = convertProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 300, OFFICES: 200 },
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA).toEqual({
      payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 300, OFFICES: 200 } },
      completed: true,
    });
  });

  it("should map newBuildingsUsesFloorSurfaceArea to step payload", () => {
    const steps = convertProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 400 },
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA).toEqual({
      payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 400 } },
      completed: true,
    });
  });

  it("should map developerWillBeBuildingsConstructor: true to step payload", () => {
    const steps = convertProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        developerWillBeBuildingsConstructor: true,
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER).toEqual({
      payload: { developerWillBeBuildingsConstructor: true },
      completed: true,
    });
  });

  it("should map developerWillBeBuildingsConstructor: false to step payload", () => {
    const steps = convertProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        developerWillBeBuildingsConstructor: false,
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER).toEqual({
      payload: { developerWillBeBuildingsConstructor: false },
      completed: true,
    });
  });

  it("should not map stakeholders buildings developer when developerWillBeBuildingsConstructor is absent", () => {
    const steps = convertProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER).toBeUndefined();
  });

  it("should map buildingsConstructionAndRehabilitationExpenses to individual fields", () => {
    const steps = convertProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        buildingsConstructionAndRehabilitationExpenses: [
          { purpose: "technical_studies_and_fees", amount: 10000 },
          { purpose: "buildings_construction_works", amount: 50000 },
          { purpose: "buildings_rehabilitation_works", amount: 20000 },
          { purpose: "other_construction_expenses", amount: 5000 },
        ],
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION).toEqual({
      payload: {
        technicalStudiesAndFees: 10000,
        buildingsConstructionWorks: 50000,
        buildingsRehabilitationWorks: 20000,
        otherConstructionExpenses: 5000,
      },
      completed: true,
    });
  });

  it("should handle partial construction expenses", () => {
    const steps = convertProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        buildingsConstructionAndRehabilitationExpenses: [
          { purpose: "technical_studies_and_fees", amount: 10000 },
        ],
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION).toEqual({
      payload: {
        technicalStudiesAndFees: 10000,
      },
      completed: true,
    });
  });
});
