import { describe, it, expect } from "vitest";

import type { UpdateProjectView } from "../updateProject.types";
import { convertPhotovoltaicProjectDataToSteps } from "./convertPhotovoltaicProjectDataToSteps";

const BASE_PROJECT_DATA: UpdateProjectView["projectData"] = {
  id: "project-1",
  createdBy: "user-1",
  createdAt: "2026-01-01",
  creationMode: "custom",
  name: "Centrale de test",
  relatedSiteId: "site-1",
  involvesReinstatement: false,
  projectPhase: "planning",
  developmentPlan: {
    type: "PHOTOVOLTAIC_POWER_PLANT",
    developer: { name: "Dev Corp", structureType: "company" },
    costs: [{ purpose: "installation_works", amount: 100000 }],
    features: {
      surfaceArea: 5000,
      electricalPowerKWc: 800,
      expectedAnnualProduction: 900,
      contractDuration: 30,
    },
  },
  soilsDistribution: [{ soilType: "IMPERMEABLE_SOILS", surfaceArea: 5000 }],
  yearlyProjectedCosts: [{ purpose: "maintenance", amount: 1000 }],
  yearlyProjectedRevenues: [{ source: "operations", amount: 50000 }],
};

const BASE_SITE_DATA: UpdateProjectView["siteData"] = {
  id: "site-1",
  name: "Friche test",
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

describe("convertPhotovoltaicProjectDataToSteps", () => {
  it("returns no steps when the saved project is not a photovoltaic project", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        developmentPlan: {
          type: "URBAN_PROJECT",
          developer: { name: "Dev Corp", structureType: "company" },
          costs: [],
          features: { buildingsFloorAreaDistribution: {} },
        },
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps).toEqual({});
  });

  it("defaults the reconstructed key parameter to POWER, since the saved project does not record which one was originally entered", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER).toEqual({
      payload: { photovoltaicKeyParameter: "POWER" },
      completed: true,
    });
  });

  it("maps the photovoltaic installation power, surface, expected production and contract duration", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER).toEqual({
      payload: { photovoltaicInstallationElectricalPowerKWc: 800 },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE).toEqual({
      payload: { photovoltaicInstallationSurfaceSquareMeters: 5000 },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION).toEqual({
      payload: { photovoltaicExpectedAnnualProduction: 900 },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION).toEqual({
      payload: { photovoltaicContractDuration: 30 },
      completed: true,
    });
  });

  it("maps involvesReinstatement: false and omits reinstatement-only steps, even on a friche where decontamination is still asked", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: { ...BASE_PROJECT_DATA, involvesReinstatement: false },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT).toEqual({
      payload: { involvesReinstatement: false },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION).toBeDefined();
    expect(steps.RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER).toBeUndefined();
    expect(steps.RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT).toBeUndefined();
  });

  it("omits decontamination steps entirely on a non-friche site with no known contamination", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: { ...BASE_PROJECT_DATA, involvesReinstatement: false },
      siteData: {
        ...BASE_SITE_DATA,
        nature: "AGRICULTURAL_OPERATION",
        hasContaminatedSoils: false,
      },
    });

    expect(steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION).toBeUndefined();
    expect(steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA).toBeUndefined();
  });

  it("maps decontaminationPlan to 'none' when involvesReinstatement is true and no soil was decontaminated", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        involvesReinstatement: true,
        decontaminatedSoilSurface: 0,
      },
      siteData: { ...BASE_SITE_DATA, hasContaminatedSoils: true, contaminatedSoilSurface: 1000 },
    });

    expect(steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION).toEqual({
      payload: { decontaminationPlan: "none", decontaminatedSurfaceArea: 0 },
      completed: true,
    });
  });

  it("maps decontaminationPlan to 'partial' when a custom non-default surface was decontaminated", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        involvesReinstatement: true,
        decontaminatedSoilSurface: 400,
      },
      siteData: { ...BASE_SITE_DATA, hasContaminatedSoils: true, contaminatedSoilSurface: 1000 },
    });

    expect(steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION).toEqual({
      payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 400 },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA).toEqual({
      payload: { decontaminatedSurfaceArea: 400 },
      completed: true,
    });
  });

  it("maps the reinstatement contract owner and reinstatement expenses when involvesReinstatement is true", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        involvesReinstatement: true,
        decontaminatedSoilSurface: 0,
        reinstatementContractOwner: { name: "Contract Owner", structureType: "company" },
        reinstatementCosts: [{ purpose: "demolition", amount: 20000 }],
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER).toEqual({
      payload: { reinstatementContractOwner: { name: "Contract Owner", structureType: "company" } },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT).toEqual({
      payload: { reinstatementExpenses: [{ purpose: "demolition", amount: 20000 }] },
      completed: true,
    });
  });

  it("reconstructs the soils transformation as the custom branch from the saved soils distribution", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        soilsDistribution: [
          { soilType: "IMPERMEABLE_SOILS", surfaceArea: 4000 },
          { soilType: "PRAIRIE_TREES", surfaceArea: 1000 },
        ],
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION).toEqual({
      payload: {
        soilsTransformationProject: "custom",
        soilsDistribution: { IMPERMEABLE_SOILS: 4000, PRAIRIE_TREES: 1000 },
      },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION).toEqual({
      payload: { futureSoilsSelection: ["IMPERMEABLE_SOILS", "PRAIRIE_TREES"] },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION).toEqual({
      payload: {
        soilsDistribution: { IMPERMEABLE_SOILS: 4000, PRAIRIE_TREES: 1000 },
      },
      completed: true,
    });
  });

  it("maps the project developer unconditionally", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER).toEqual({
      payload: { projectDeveloper: { name: "Dev Corp", structureType: "company" } },
      completed: true,
    });
  });

  it("maps the future operator only when present", () => {
    const withOperator = convertPhotovoltaicProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        futureOperator: { name: "Operator Corp", structureType: "company" },
      },
      siteData: BASE_SITE_DATA,
    });
    expect(withOperator.RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR).toEqual({
      payload: { futureOperator: { name: "Operator Corp", structureType: "company" } },
      completed: true,
    });

    const withoutOperator = convertPhotovoltaicProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });
    expect(withoutOperator.RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR).toBeUndefined();
  });

  it("derives willSiteBePurchased: false and omits purchase-only steps when no selling price was saved", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE).toEqual({
      payload: { willSiteBePurchased: false },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER).toBeUndefined();
    expect(steps.RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS).toBeUndefined();
  });

  it("derives willSiteBePurchased: true and maps the future site owner and purchase amounts when a selling price was saved", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        sitePurchaseSellingPrice: 300000,
        sitePurchasePropertyTransferDuties: 15000,
        futureSiteOwner: { name: "New Owner", structureType: "company" },
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE).toEqual({
      payload: { willSiteBePurchased: true },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER).toEqual({
      payload: { futureSiteOwner: { name: "New Owner", structureType: "company" } },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS).toEqual({
      payload: { sellingPrice: 300000, propertyTransferDuties: 15000 },
      completed: true,
    });
  });

  it("maps the photovoltaic panels installation expenses, yearly costs and yearly revenues", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION).toEqual({
      payload: {
        photovoltaicPanelsInstallationExpenses: [{ purpose: "installation_works", amount: 100000 }],
      },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES).toEqual({
      payload: { yearlyProjectedExpenses: [{ purpose: "maintenance", amount: 1000 }] },
      completed: true,
    });
    expect(steps.RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE).toEqual({
      payload: { yearlyProjectedRevenues: [{ source: "operations", amount: 50000 }] },
      completed: true,
    });
  });

  it("maps financial assistance revenues, defaulting to an empty list when none were saved", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: BASE_PROJECT_DATA,
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE).toEqual({
      payload: { financialAssistanceRevenues: [] },
      completed: true,
    });
  });

  it("maps the schedule projection, folding in the reinstatement schedule only when involvesReinstatement is true", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: {
        ...BASE_PROJECT_DATA,
        involvesReinstatement: true,
        decontaminatedSoilSurface: 0,
        operationsFirstYear: 2030,
        reinstatementSchedule: { startDate: "2028-01-01", endDate: "2028-06-01" },
        developmentPlan: {
          ...BASE_PROJECT_DATA.developmentPlan,
          installationSchedule: { startDate: "2029-01-01", endDate: "2029-06-01" },
        },
      },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_SCHEDULE_PROJECTION).toEqual({
      payload: {
        photovoltaicInstallationSchedule: { startDate: "2029-01-01", endDate: "2029-06-01" },
        reinstatementSchedule: { startDate: "2028-01-01", endDate: "2028-06-01" },
        firstYearOfOperation: 2030,
      },
      completed: true,
    });
  });

  it("maps the project name and description", () => {
    const steps = convertPhotovoltaicProjectDataToSteps({
      projectData: { ...BASE_PROJECT_DATA, name: "Ma centrale", description: "Une description" },
      siteData: BASE_SITE_DATA,
    });

    expect(steps.RENEWABLE_ENERGY_NAMING).toEqual({
      payload: { name: "Ma centrale", description: "Une description" },
      completed: true,
    });
  });
});
