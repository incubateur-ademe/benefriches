import { FricheActivity } from "../domain/friche.types";
import { SiteDraft } from "../domain/siteFoncier.types";

import { SoilType } from "@/shared/domain/soils";

export const siteWithExhaustiveData: SiteDraft = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  name: "My site name",
  description: "Description of the site",
  owner: { structureType: "company", name: "SAS Owner" },
  tenant: { structureType: "company", name: "Tenant SARL" },
  soils: [
    SoilType.BUILDINGS,
    SoilType.MINERAL_SOIL,
    SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
    SoilType.FOREST_DECIDUOUS,
  ],
  soilsDistribution: {
    [SoilType.BUILDINGS]: 3000,
    [SoilType.MINERAL_SOIL]: 5000,
    [SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED]: 10000,
    [SoilType.FOREST_DECIDUOUS]: 12000,
  },
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
      purpose: "otherTaxes",
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
  hasContaminatedSoils: true,
  contaminatedSoilSurface: 2300,
  hasRecentAccidents: true,
  severeInjuriesPersons: 1,
  minorInjuriesPersons: 2,
  deaths: 0,
  fricheActivity: FricheActivity.INDUSTRY,
} as const;

export const siteWithMinimalData: SiteDraft = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  name: "My site name",
  owner: { structureType: "company", name: "SAS Owner" },
  soils: [
    SoilType.BUILDINGS,
    SoilType.MINERAL_SOIL,
    SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
    SoilType.FOREST_DECIDUOUS,
  ],
  soilsDistribution: {
    [SoilType.BUILDINGS]: 3000,
    [SoilType.MINERAL_SOIL]: 5000,
    [SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED]: 10000,
    [SoilType.FOREST_DECIDUOUS]: 12000,
  },
  surfaceArea: 30000,
  yearlyExpenses: [],
  yearlyIncomes: [],
  isFriche: false,
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
