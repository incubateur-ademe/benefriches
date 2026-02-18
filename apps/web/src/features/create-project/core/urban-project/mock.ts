import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

export const MOCK = {
  URBAN_PROJECT_USES_INTRODUCTION: { completed: true },
  URBAN_PROJECT_USES_SELECTION: {
    completed: true,
    payload: {
      usesSelection: ["RESIDENTIAL", "LOCAL_STORE", "PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"],
    },
  },
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
    completed: true,
    payload: { publicGreenSpacesSurfaceArea: 3750 },
  },
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION: { completed: true },
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
    completed: true,
    payload: {
      publicGreenSpacesSoilsDistribution: {
        PRAIRIE_GRASS: 1875,
        ARTIFICIAL_TREE_FILLED: 937.5,
        WATER: 937.5,
      },
    },
  },
  URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
    completed: true,
    payload: {
      usesFloorSurfaceAreaDistribution: {
        RESIDENTIAL: 2500,
        LOCAL_STORE: 2500,
      },
    },
  },
  URBAN_PROJECT_SPACES_INTRODUCTION: { completed: true },
  URBAN_PROJECT_SPACES_SELECTION: {
    completed: true,
    payload: {
      spacesSelection: [
        "BUILDINGS",
        "IMPERMEABLE_SOILS",
        "MINERAL_SOIL",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      ],
    },
  },
  URBAN_PROJECT_SPACES_SURFACE_AREA: {
    completed: true,
    payload: {
      spacesSurfaceAreaDistribution: {
        BUILDINGS: 2812.5,
        IMPERMEABLE_SOILS: 2812.5,
        MINERAL_SOIL: 2812.5,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2812.5,
      },
    },
  },
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: { completed: true },
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: { completed: true },
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: { completed: true },
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: { completed: true },
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
    completed: true,
    payload: { projectDeveloper: { name: "Mairie d'Angers", structureType: "municipality" } },
  },
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: { completed: true },
  URBAN_PROJECT_SITE_RESALE_SELECTION: {
    completed: true,
    payload: {
      siteResaleSelection: "yes",
    },
  },
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
    completed: true,
    payload: { buildingsResalePlannedAfterDevelopment: false },
  },
  URBAN_PROJECT_EXPENSES_INTRODUCTION: { completed: true },
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: {
    completed: true,
    payload: { sitePurchasePropertyTransferDuties: 2905, sitePurchaseSellingPrice: 50000 },
  },
  URBAN_PROJECT_EXPENSES_INSTALLATION: {
    completed: true,
    defaultValues: {
      installationExpenses: [
        { purpose: "development_works", amount: 810000 },
        { purpose: "technical_studies", amount: 90000 },
        { purpose: "other", amount: 81000 },
      ],
    },
    payload: {
      installationExpenses: [
        { amount: 810000, purpose: "development_works" },
        { amount: 90000, purpose: "technical_studies" },
        { amount: 81000, purpose: "other" },
      ],
    },
  },
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
    completed: true,
    payload: {
      yearlyProjectedBuildingsOperationsExpenses: [
        { purpose: "maintenance", amount: 25880 },
        { purpose: "taxes", amount: 2540 },
        { purpose: "other", amount: 1500 },
      ],
    },
  },
  URBAN_PROJECT_REVENUE_INTRODUCTION: { completed: true },
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
    completed: true,
    payload: {
      siteResaleExpectedSellingPrice: 61000,
      siteResaleExpectedPropertyTransferDuties: 3544.1,
    },
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: {
    completed: true,
    payload: { yearlyProjectedRevenues: [{ source: "rent", amount: 5000 }] },
  },
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: {
    completed: true,
    payload: {
      financialAssistanceRevenues: [
        { amount: 6500, source: "local_or_regional_authority_participation" },
        { amount: 15880, source: "public_subsidies" },
        { amount: 250, source: "other" },
      ],
    },
  },
  URBAN_PROJECT_SCHEDULE_PROJECTION: {
    completed: true,
    defaultValues: {
      installationSchedule: { startDate: "Mon Sep 08 2025", endDate: "Tue Sep 08 2026" },
      firstYearOfOperation: 2026,
    },
    payload: {
      installationSchedule: { startDate: "2025-09-08", endDate: "2026-09-08" },
      firstYearOfOperation: 2026,
    },
  },
  URBAN_PROJECT_PROJECT_PHASE: { completed: true, payload: { projectPhase: "planning" } },
  URBAN_PROJECT_NAMING: {
    completed: true,
    defaultValues: { name: "Projet urbain mixte" },
    payload: { name: "Projet urbain mixte", description: "" },
  },
} satisfies ProjectFormState["urbanProject"]["steps"];
