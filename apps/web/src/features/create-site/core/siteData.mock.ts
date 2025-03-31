import { SiteCreationData, SiteExpressCreationData } from "../core/siteFoncier.types";

export const siteWithExhaustiveData = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  name: "My site name",
  description: "Description of the site",
  owner: { structureType: "company", name: "SAS Owner" },
  isSiteOperated: true,
  tenant: { structureType: "company", name: "Tenant SARL" },
  soils: ["BUILDINGS", "MINERAL_SOIL", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "FOREST_DECIDUOUS"],
  soilsDistribution: {
    ["BUILDINGS"]: 3000,
    ["MINERAL_SOIL"]: 5000,
    ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED"]: 10000,
    ["FOREST_DECIDUOUS"]: 12000,
  },
  spacesDistributionKnowledge: true,
  surfaceArea: 30000,
  yearlyExpenses: [
    {
      amount: 74539,
      bearer: "tenant",
      purpose: "rent",
    },
    {
      amount: 3900,
      bearer: "owner",
      purpose: "propertyTaxes",
    },
    {
      amount: 2100,
      bearer: "tenant",
      purpose: "operationsTaxes",
    },
    {
      amount: 6049,
      bearer: "tenant",
      purpose: "maintenance",
    },
    {
      amount: 15000,
      bearer: "tenant",
      purpose: "security",
    },
    {
      amount: 3400,
      bearer: "tenant",
      purpose: "illegalDumpingCost",
    },
    {
      amount: 800,
      bearer: "tenant",
      purpose: "accidentsCost",
    },
  ],
  yearlyIncomes: [{ amount: 150000, source: "operations" }],
  isFriche: false,
  nature: "AGRICULTURAL_OPERATION",
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
} as const satisfies SiteCreationData;

export const fricheWithExhaustiveData = {
  ...siteWithExhaustiveData,
  description: "Description of the friche",
  isFriche: true,
  nature: "FRICHE",
  isSiteOperated: undefined,
  isFricheLeased: true,
  hasContaminatedSoils: true,
  contaminatedSoilSurface: 2300,
  hasRecentAccidents: true,
  accidentsSevereInjuries: 1,
  accidentsMinorInjuries: 2,
  accidentsDeaths: 0,
  fricheActivity: "INDUSTRY",
} as const satisfies SiteCreationData;

export const siteWithMinimalData = {
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
  spacesDistributionKnowledge: true,
  surfaceArea: 30000,
  yearlyExpenses: [],
  yearlyIncomes: [],
  isFriche: false,
  nature: "AGRICULTURAL_OPERATION",
  isSiteOperated: false,
  hasRecentAccidents: false,
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
} as const satisfies SiteCreationData;

export const fricheWithMinimalData = {
  ...siteWithMinimalData,
  isFriche: true,
  nature: "FRICHE",
  fricheActivity: "RAILWAY",
} as const satisfies SiteCreationData;

export const expressFricheCreationData = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  isFriche: true,
  nature: "FRICHE",
  address: {
    banId: "31070_p4ur8e",
    value: "Blajan",
    city: "Blajan",
    cityCode: "31070",
    postCode: "31350",
    long: 0.664699,
    lat: 43.260859,
  },
  surfaceArea: 15000,
} as const satisfies SiteExpressCreationData;
