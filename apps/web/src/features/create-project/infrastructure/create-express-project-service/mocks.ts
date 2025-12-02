import { BaseReconversionProjectFeaturesView } from "shared";
import { v4 as uuid } from "uuid";

export const mockedGeneratedUrbanProject = {
  id: uuid(),
  name: "Urban project",
  description: "A urban project description",
  isExpress: false,
  soilsDistribution: [
    {
      soilType: "BUILDINGS",
      surfaceArea: 7000,
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      surfaceArea: 10000,
      spaceCategory: "PUBLIC_GREEN_SPACE",
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      surfaceArea: 3000,
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
    },
  ],
  developmentPlan: {
    type: "URBAN_PROJECT",
    installationCosts: [
      { amount: 35000, purpose: "other" },
      { amount: 125000, purpose: "development_works" },
    ],
    buildingsFloorAreaDistribution: {
      RESIDENTIAL: 5000,
      LOCAL_SERVICES: 2000,
    },
    developerName: "Promoteur immo",
    installationSchedule: {
      startDate: "2025-01-01",
      endDate: "2025-05-15",
    },
  },
  reinstatementSchedule: {
    startDate: "2024-07-01",
    endDate: "2024-12-31",
  },
  reinstatementCosts: [
    { purpose: "waste_collection", amount: 1000 },
    { purpose: "deimpermeabilization", amount: 500 },
  ],
  futureOperator: "Mairie de Blajan",
  futureOwner: "Mairie de Blajan",
  reinstatementContractOwner: "Mairie de Blajan",
  sitePurchaseTotalAmount: 108000,
  financialAssistanceRevenues: [{ amount: 45000, source: "public_subsidies" }],
  yearlyProjectedExpenses: [{ amount: 10000, purpose: "taxes" }],
  yearlyProjectedRevenues: [],
  firstYearOfOperation: 2025,
  siteResaleSellingPrice: 125000,
  buildingsResaleSellingPrice: 140000,
  decontaminatedSoilSurface: 1000,
} as const satisfies BaseReconversionProjectFeaturesView;

export const mockedGeneratedPhotovoltaicProject = {
  id: "189038dd-3a6a-43af-bc8d-c4999d8d82ca",
  name: "Mocked project name",
  description: "Mocked project description",
  isExpress: true,
  developmentPlan: {
    type: "PHOTOVOLTAIC_POWER_PLANT",
    developerName: "ADEME",
    installationCosts: [{ amount: 12000, purpose: "installation_works" }],
    installationSchedule: {
      startDate: "2029-01-01",
      endDate: "2029-12-31",
    },
    electricalPowerKWc: 12309,
    surfaceArea: 120000,
    expectedAnnualProduction: 4399,
    contractDuration: 20,
  },
  soilsDistribution: [
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      surfaceArea: 115000,
    },
    { soilType: "MINERAL_SOIL", surfaceArea: 3500 },
    { soilType: "IMPERMEABLE_SOILS", surfaceArea: 1500 },
  ],
  futureOwner: "ADEME",
  futureOperator: "ADEME",
  reinstatementContractOwner: "ADEME",
  financialAssistanceRevenues: [{ amount: 9999, source: "public_subsidies" }],
  reinstatementCosts: [
    {
      amount: 9999,
      purpose: "deimpermeabilization",
    },
  ],
  yearlyProjectedExpenses: [
    { amount: 9999, purpose: "maintenance" },
    { amount: 4009, purpose: "taxes" },
  ],
  yearlyProjectedRevenues: [
    {
      amount: 34000,
      source: "operations",
    },
  ],
  reinstatementSchedule: {
    startDate: "2029-01-01",
    endDate: "2029-12-31",
  },
  firstYearOfOperation: 2030,
  sitePurchaseTotalAmount: 540000,
} as const satisfies BaseReconversionProjectFeaturesView;
