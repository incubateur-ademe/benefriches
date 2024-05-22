import { FricheActivity } from "../domain/friche.types";
import { SiteDraft } from "../domain/siteFoncier.types";

export const siteWithExhaustiveData: SiteDraft = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  name: "My site name",
  description: "Description of the site",
  owner: { structureType: "company", name: "SAS Owner" },
  isSiteWorked: true,
  tenant: { structureType: "company", name: "Tenant SARL" },
  soils: ["BUILDINGS", "MINERAL_SOIL", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "FOREST_DECIDUOUS"],
  soilsDistribution: {
    ["BUILDINGS"]: 3000,
    ["MINERAL_SOIL"]: 5000,
    ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED"]: 10000,
    ["FOREST_DECIDUOUS"]: 12000,
  },
  soilsDistributionEntryMode: "square_meters",
  surfaceArea: 30000,
  yearlyExpenses: [
    {
      amount: 74539,
      bearer: "tenant",
      purpose: "rent",
      purposeCategory: "rent",
    },
    {
      amount: 3900,
      bearer: "owner",
      purpose: "propertyTaxes",
      purposeCategory: "taxes",
    },
    {
      amount: 2100,
      bearer: "tenant",
      purpose: "operationsTaxes",
      purposeCategory: "taxes",
    },
    {
      amount: 6049,
      bearer: "tenant",
      purpose: "maintenance",
      purposeCategory: "site_management",
    },
    {
      amount: 15000,
      bearer: "tenant",
      purpose: "security",
      purposeCategory: "safety",
    },
    {
      amount: 3400,
      bearer: "tenant",
      purpose: "illegalDumpingCost",
      purposeCategory: "safety",
    },
    {
      amount: 800,
      bearer: "tenant",
      purpose: "accidentsCost",
      purposeCategory: "safety",
    },
  ],
  yearlyIncomes: [{ amount: 150000, source: "income" }],
  isFriche: false,
  fullTimeJobsInvolved: 0.5,
  hasContaminatedSoils: false,
  contaminatedSoilSurface: 1000,
  address: {
    banId: "31070_p4ur8e",
    value: "Sendere 31350 Blajan",
    city: "Blajan",
    cityCode: "31070",
    postCode: "31350",
    streetName: "Sendere",
    long: 0.664699,
    lat: 43.260859,
  },
} as const;

export const fricheWithExhaustiveData: SiteDraft = {
  ...siteWithExhaustiveData,
  isFriche: true,
  isSiteWorked: undefined,
  isFricheLeased: true,
  hasContaminatedSoils: true,
  contaminatedSoilSurface: 2300,
  hasRecentAccidents: true,
  accidentsSevereInjuries: 1,
  accidentsMinorInjuries: 2,
  accidentsDeaths: 0,
  fricheActivity: FricheActivity.INDUSTRY,
} as const;

export const siteWithMinimalData: SiteDraft = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  name: "My site name",
  owner: { structureType: "company", name: "SAS Owner" },
  soils: ["BUILDINGS", "MINERAL_SOIL", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "FOREST_DECIDUOUS"],
  soilsDistribution: {
    ["BUILDINGS"]: 3000,
    ["MINERAL_SOIL"]: 5000,
    ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED"]: 10000,
    ["FOREST_DECIDUOUS"]: 12000,
  },
  soilsDistributionEntryMode: "square_meters",
  surfaceArea: 30000,
  yearlyExpenses: [],
  yearlyIncomes: [],
  isFriche: false,
  isSiteWorked: false,
  hasRecentAccidents: false,
  fullTimeJobsInvolved: 0.5,
  hasContaminatedSoils: false,
  address: {
    banId: "31070_p4ur8e",
    value: "Sendere 31350 Blajan",
    city: "Blajan",
    cityCode: "31070",
    postCode: "31350",
    streetName: "Sendere",
    long: 0.664699,
    lat: 43.260859,
  },
} as const;

export const fricheWithMinimalData: SiteDraft = {
  ...siteWithMinimalData,
  isFriche: true,
  fricheActivity: FricheActivity.RAILWAY,
} as const;
