import { UrbanSprawlImpactsComparisonObj } from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";

const projectData: UrbanSprawlImpactsComparisonObj["projectData"] = {
  id: "bf8a7d1d-a9d2-4a66-b2bc-3b8d682f9932",
  name: "Centralité urbaine",
  isExpressProject: true,
  decontaminatedSoilSurface: 0,
  operationsFirstYear: 2027,
  developmentPlan: {
    installationCosts: [
      { amount: 90000, purpose: "technical_studies" },
      { amount: 810000, purpose: "development_works" },
      { amount: 81000, purpose: "other" },
    ],
    developerName: "Mairie de Blajan",
    installationSchedule: {
      startDate: "2025-06-17T07:39:38.123Z",
      endDate: "2026-06-17T07:39:38.123Z",
    },
    type: "URBAN_PROJECT",
    features: {
      spacesDistribution: {
        BUILDINGS_FOOTPRINT: 4387.5,
        PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 487.5,
        PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 487.5,
        PRIVATE_GARDEN_AND_GRASS_ALLEYS: 4387.5,
        PUBLIC_GREEN_SPACES: 2250,
        PUBLIC_PARKING_LOT: 1350,
        PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 150,
        PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 750,
        PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 750,
      },
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 7440,
        LOCAL_STORE: 240,
        OFFICES: 480,
        LOCAL_SERVICES: 960,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 240,
        PUBLIC_FACILITIES: 240,
      },
    },
  },
  soilsDistribution: {
    BUILDINGS: 4387.5,
    IMPERMEABLE_SOILS: 1987.5,
    MINERAL_SOIL: 1237.5,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 7387.5,
  },
  yearlyProjectedExpenses: [],
  yearlyProjectedRevenues: [],
  sitePurchaseTotalAmount: 1800000,
  sitePurchasePropertyTransferDutiesAmount: 17400,
  relatedSiteId: "",
  reinstatementExpenses: [],
  financialAssistanceRevenues: [],
};

const baseCase: UrbanSprawlImpactsComparisonObj["baseCase"] = {
  siteData: {
    id: "e3f34bca-0be0-4896-a559-41d977cff70f",
    name: "Friche industrielle de Blajan",
    nature: "FRICHE",
    isExpressSite: true,
    fricheActivity: "INDUSTRY",
    ownerName: "Mairie de Blajan",
    ownerStructureType: "municipality",
    contaminatedSoilSurface: 7500,
    surfaceArea: 15000,
    address: {
      banId: "31070",
      value: "Blajan",
      city: "Blajan",
      cityCode: "31070",
      postCode: "31350",
      lat: 43.260128,
      long: 0.652416,
    },
    soilsDistribution: {
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
      BUILDINGS: 6000,
      IMPERMEABLE_SOILS: 6000,
    },
    yearlyExpenses: [
      { amount: 18, purpose: "illegalDumpingCost", bearer: "owner" },
      { amount: 16960, purpose: "propertyTaxes", bearer: "owner" },
      { amount: 33000, purpose: "security", bearer: "owner" },
      { amount: 42000, purpose: "maintenance", bearer: "owner" },
    ],
    yearlyIncomes: [],
  },
  impacts: {
    economicBalance: {
      total: -688537,
      bearer: "Mairie de Blajan",
      costs: {
        total: 2505937.5,
        developmentPlanInstallation: {
          total: 981000,
          costs: [
            { amount: 90000, purpose: "technical_studies" },
            { amount: 810000, purpose: "development_works" },
            { amount: 81000, purpose: "other" },
          ],
        },
        siteReinstatement: {
          total: 1524937.5,
          costs: [
            { amount: 56250, purpose: "deimpermeabilization" },
            { amount: 197437.5, purpose: "sustainable_soils_reinstatement" },
            { amount: 371250, purpose: "remediation" },
            { amount: 450000, purpose: "demolition" },
            { amount: 450000, purpose: "asbestos_removal" },
          ],
        },
      },
      revenues: { total: 1817400, siteResale: 1817400 },
    },
    social: {
      fullTimeJobs: {
        base: 0,
        forecast: 11.1,
        difference: 11.1,
        operations: { base: 0, forecast: 10.6, difference: 10.6 },
        conversion: { base: 0, forecast: 0.5, difference: 0.5 },
      },
      avoidedVehiculeKilometers: 900673.44,
      travelTimeSaved: 36277.12,
    },
    environmental: {
      nonContaminatedSurfaceArea: { base: 7500, forecast: 13125, difference: 5625 },
      permeableSurfaceArea: {
        base: 3000,
        forecast: 8625,
        difference: 5625,
        greenSoil: { base: 3000, forecast: 7387.5, difference: 4387.5 },
        mineralSoil: { base: 0, forecast: 1237.5, difference: 1237.5 },
      },
      soilsCo2eqStorage: { base: 222.2, forecast: 305.84, difference: 83.63999999999999 },
      soilsCarbonStorage: {
        base: 60.6,
        forecast: 83.41,
        difference: 22.809999999999995,
        BUILDINGS: { base: 18, forecast: 13.16, difference: -4.84 },
        IMPERMEABLE_SOILS: { base: 18, forecast: 5.96, difference: -12.04 },
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: { base: 24.6, forecast: 60.58, difference: 35.98 },
        MINERAL_SOIL: { base: 0, forecast: 3.71, difference: 3.71 },
      },
      avoidedCo2eqEmissions: { withCarTrafficDiminution: 95.2 },
    },
    socioeconomic: {
      impacts: [
        {
          amount: 1019742,
          actor: "Mairie de Blajan",
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
          details: [
            { amount: 245, impact: "avoided_illegal_dumping_costs" },
            { amount: 448579, impact: "avoided_security_costs" },
            { amount: 570918, impact: "avoided_maintenance_costs" },
          ],
        },
        {
          impact: "water_regulation",
          impactCategory: "environmental_monetary",
          actor: "community",
          amount: 1086,
        },
        {
          impact: "ecosystem_services",
          impactCategory: "environmental_monetary",
          actor: "human_society",
          amount: 21209,
          details: [
            { amount: 18879, impact: "soils_co2_eq_storage" },
            { amount: 2330, impact: "water_cycle" },
          ],
        },
        {
          impact: "taxes_income",
          actor: "community",
          impactCategory: "economic_indirect",
          amount: 1395780,
          details: [
            { amount: 342888, impact: "project_new_houses_taxes_income" },
            { amount: 1052892, impact: "project_new_company_taxation_income" },
          ],
        },
        {
          amount: 26829,
          impact: "avoided_co2_eq_emissions",
          impactCategory: "environmental_monetary",
          actor: "human_society",
          details: [{ amount: 26829, impact: "avoided_traffic_co2_eq_emissions" }],
        },
        {
          actor: "french_society",
          amount: 7122,
          impact: "avoided_air_pollution",
          impactCategory: "social_monetary",
        },
        {
          actor: "local_people",
          amount: 88111,
          impact: "avoided_car_related_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "french_society",
          amount: 219,
          impact: "avoided_property_damages_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "local_people",
          amount: 294856,
          impact: "travel_time_saved",
          impactCategory: "social_monetary",
        },
        {
          actor: "local_people",
          amount: 7850,
          impact: "local_property_value_increase",
          impactCategory: "economic_indirect",
        },
        {
          actor: "community",
          amount: 198,
          impact: "local_transfer_duties_increase",
          impactCategory: "economic_indirect",
        },
        {
          impact: "roads_and_utilities_maintenance_expenses",
          amount: -169915,
          actor: "community",
          impactCategory: "economic_direct",
        },
      ],
      total: 2693087,
    },
  },
};

const comparisonCase: UrbanSprawlImpactsComparisonObj["baseCase"] = {
  siteData: {
    id: "2ee6f27d-5c59-4a25-a571-f156333f3858",
    name: "Exploitation agricole de Blajan",
    nature: "AGRICULTURAL_OPERATION",
    isExpressSite: true,
    description: "Grandes cultures légumières",
    agriculturalOperationActivity: "LARGE_VEGETABLE_CULTIVATION",
    ownerName: "Mairie de Blajan",
    ownerStructureType: "municipality",
    surfaceArea: 15000,
    address: {
      banId: "31070",
      value: "Blajan",
      city: "Blajan",
      cityCode: "31070",
      postCode: "31350",
      lat: 43.260128,
      long: 0.652416,
    },
    soilsDistribution: { BUILDINGS: 750, CULTIVATION: 14250 },
    yearlyExpenses: [
      { amount: 45, purpose: "taxes", bearer: "tenant" },
      { amount: 330, purpose: "rent", bearer: "tenant" },
      { amount: 3945, purpose: "otherOperationsCosts", bearer: "tenant" },
    ],
    yearlyIncomes: [
      { amount: 345, source: "other" },
      { amount: 540, source: "subsidies" },
      { amount: 4530, source: "product-sales" },
    ],
  },
  impacts: {
    economicBalance: {
      total: 836400,
      bearer: "Mairie de Blajan",
      costs: {
        total: 981000,
        developmentPlanInstallation: {
          total: 981000,
          costs: [
            { amount: 90000, purpose: "technical_studies" },
            { amount: 810000, purpose: "development_works" },
            { amount: 81000, purpose: "other" },
          ],
        },
      },
      revenues: { total: 1817400, siteResale: 1817400 },
    },
    social: {
      fullTimeJobs: {
        base: 1.7,
        forecast: 10.6,
        difference: 8.9,
        operations: { base: 1.7, forecast: 10.6, difference: 8.9 },
        conversion: { base: 0, forecast: 0, difference: 0 },
      },
      avoidedVehiculeKilometers: 900673.44,
      travelTimeSaved: 36277.12,
    },
    environmental: {
      permeableSurfaceArea: {
        base: 14250,
        forecast: 8625,
        difference: -5625,
        greenSoil: { base: 14250, forecast: 7387.5, difference: -6862.5 },
        mineralSoil: { base: 0, forecast: 1237.5, difference: 1237.5 },
      },
      soilsCo2eqStorage: { base: 274.74, forecast: 305.84, difference: 31.099999999999966 },
      soilsCarbonStorage: {
        base: 74.93,
        forecast: 83.41,
        difference: 8.47999999999999,
        CULTIVATION: { base: 72.68, forecast: 0, difference: -72.68 },
        BUILDINGS: { base: 2.25, forecast: 13.16, difference: 10.91 },
        IMPERMEABLE_SOILS: { base: 0, forecast: 5.96, difference: 5.96 },
        MINERAL_SOIL: { base: 0, forecast: 3.71, difference: 3.71 },
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: { base: 0, forecast: 60.58, difference: 60.58 },
      },
      avoidedCo2eqEmissions: { withCarTrafficDiminution: 98.4 },
    },
    socioeconomic: {
      impacts: [
        {
          amount: -4486,
          actor: "Mairie de Blajan",
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
        {
          impact: "ecosystem_services",
          impactCategory: "environmental_monetary",
          actor: "human_society",
          amount: 3448,
          details: [
            { amount: 5722, impact: "soils_co2_eq_storage" },
            { amount: -2274, impact: "water_cycle" },
          ],
        },
        {
          impact: "taxes_income",
          actor: "community",
          impactCategory: "economic_indirect",
          amount: 1362874,
          details: [
            { amount: 334804, impact: "project_new_houses_taxes_income" },
            { amount: 1028070, impact: "project_new_company_taxation_income" },
          ],
        },
        {
          amount: 24418,
          impact: "avoided_co2_eq_emissions",
          impactCategory: "environmental_monetary",
          actor: "human_society",
          details: [{ amount: 24418, impact: "avoided_traffic_co2_eq_emissions" }],
        },
        {
          actor: "french_society",
          amount: 6954,
          impact: "avoided_air_pollution",
          impactCategory: "social_monetary",
        },
        {
          actor: "local_people",
          amount: 86034,
          impact: "avoided_car_related_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "french_society",
          amount: 214,
          impact: "avoided_property_damages_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "local_people",
          amount: 287905,
          impact: "travel_time_saved",
          impactCategory: "social_monetary",
        },
      ],
      total: 1767361,
    },
  },
};

export const comparisonResultMock = {
  projectData: projectData,
  baseCase: {
    siteData: baseCase.siteData,
    impacts: baseCase.impacts,
  },
  comparisonCase: {
    siteData: comparisonCase.siteData,
    impacts: comparisonCase.impacts,
  },
} as const satisfies UrbanSprawlImpactsComparisonObj;
