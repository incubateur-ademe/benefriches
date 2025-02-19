import {
  AvoidedTrafficAccidentsImpact,
  EcosystemServicesImpact,
  AvoidedFricheCostsImpact,
} from "shared";

import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchImpactsForReconversionProject.action";
import { ProjectFeatures, UrbanProjectFeatures } from "@/features/projects/domain/projects.types";
import { SiteFeatures } from "@/features/site-features/core/siteFeatures";

export const DEMO_SITE = {
  id: "690b9489-b2a2-47b3-9e91-a27c998b7f55",
  name: "Friche industrielle de Mauges-sur-Loire",
  isExpressSite: false,
  fricheActivity: "INDUSTRY",
  isFriche: true,
  ownerName: "Mairie de Mauges-sur-Loire",
  surfaceArea: 50000,
  address: "Mauges-sur-Loire",
  soilsDistribution: {
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
    BUILDINGS: 5000,
    IMPERMEABLE_SOILS: 15000,
    MINERAL_SOIL: 25000,
  },
  expenses: [
    { amount: 200, purpose: "propertyTaxes" },
    { amount: 775, purpose: "illegalDumpingCost" },
    { amount: 35000, purpose: "maintenance" },
  ],
  accidents: {},
} as const satisfies SiteFeatures;

export const DEMO_PROJECT = {
  id: "cef23bf6-bad9-4408-b38c-0116e9d4bf9b",
  name: "Projet urbain",
  decontaminatedSoilSurface: 7500,
  firstYearOfOperation: 2028,
  developmentPlan: {
    installationCosts: [
      { amount: 300000, purpose: "technical_studies" },
      { amount: 2700000, purpose: "development_works" },
      { amount: 270000, purpose: "other" },
    ],
    developerName: "Mairie de Mauges-sur-Loire",
    installationSchedule: {
      startDate: "2026-11-14T10:27:41.602Z",
      endDate: "2027-11-14T10:27:41.602Z",
    },
    type: "URBAN_PROJECT",
    spaces: {
      BUILDINGS_FOOTPRINT: 14625,
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 1625,
      PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 1625,
      PRIVATE_GARDEN_AND_GRASS_ALLEYS: 14625,
      PUBLIC_GREEN_SPACES: 7500,
      PUBLIC_PARKING_LOT: 4500,
      PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 500,
      PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 2500,
      PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 2500,
    },
    buildingsFloorArea: {
      RESIDENTIAL: 24800,
      LOCAL_STORE: 800,
      OFFICES: 1600,
      LOCAL_SERVICES: 3200,
      ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 800,
      PUBLIC_FACILITIES: 800,
    },
  },
  soilsDistribution: {
    BUILDINGS: 14625,
    IMPERMEABLE_SOILS: 6625,
    MINERAL_SOIL: 4125,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 24625,
  },
  yearlyProjectedExpenses: [],
  yearlyProjectedRevenues: [],
  reinstatementContractOwner: "Mairie de Mauges-sur-Loire",
  reinstatementSchedule: {
    startDate: "2025-11-14T10:27:41.601Z",
    endDate: "2026-11-14T10:27:41.601Z",
  },
  reinstatementCosts: [
    { amount: 495000, purpose: "remediation" },
    { amount: 375000, purpose: "demolition" },
    { amount: 375000, purpose: "asbestos_removal" },
  ],
  siteResaleSellingPrice: 6416318.4,
} as const satisfies Omit<ProjectFeatures, "developmentPlan"> & {
  developmentPlan: UrbanProjectFeatures;
};

export const IMPACTS_DATA = {
  id: "cef23bf6-bad9-4408-b38c-0116e9d4bf9b",
  name: "Projet urbain",
  relatedSiteId: "690b9489-b2a2-47b3-9e91-a27c998b7f55",
  relatedSiteName: "Friche industrielle de Mauges-sur-Loire",
  isExpressSite: false,
  projectData: {
    soilsDistribution: {
      BUILDINGS: 14625,
      IMPERMEABLE_SOILS: 6625,
      MINERAL_SOIL: 4125,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 24625,
    },
    contaminatedSoilSurface: 2500,
    isExpressProject: true,
    developmentPlan: {
      spacesDistribution: {
        BUILDINGS_FOOTPRINT: 14625,
        PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 1625,
        PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 1625,
        PRIVATE_GARDEN_AND_GRASS_ALLEYS: 14625,
        PUBLIC_GREEN_SPACES: 7500,
        PUBLIC_PARKING_LOT: 4500,
        PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 500,
        PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 2500,
        PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 2500,
      },
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 24800,
        LOCAL_STORE: 800,
        OFFICES: 1600,
        LOCAL_SERVICES: 3200,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 800,
        PUBLIC_FACILITIES: 800,
      },
      type: "URBAN_PROJECT",
    },
  },
  siteData: {
    addressLabel: "Mauges-sur-Loire",
    contaminatedSoilSurface: 10000,
    soilsDistribution: {
      BUILDINGS: 5000,
      IMPERMEABLE_SOILS: 15000,
      MINERAL_SOIL: 25000,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
    },
    surfaceArea: 50000,
    isFriche: true,
    fricheActivity: "INDUSTRY",
    owner: { name: "Mairie de Mauges-sur-Loire", structureType: "municipality" },
  },
  impacts: {
    economicBalance: {
      total: 1901318.4000000004,
      bearer: "Mairie de Mauges-sur-Loire",
      costs: {
        total: 4515000,
        developmentPlanInstallation: {
          total: 3270000,
          costs: [
            { amount: 300000, purpose: "technical_studies" },
            { amount: 2700000, purpose: "development_works" },
            { amount: 270000, purpose: "other" },
          ],
        },
        siteReinstatement: {
          total: 1245000,
          costs: [
            { amount: 495000, purpose: "remediation" },
            { amount: 375000, purpose: "demolition" },
            { amount: 375000, purpose: "asbestos_removal" },
          ],
        },
      },
      revenues: { total: 6416318.4, siteResale: 6416318.4 },
    },
    socioeconomic: {
      impacts: [
        {
          amount: 35775,
          actor: "Mairie de Mauges-sur-Loire",
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
          details: [
            { amount: 35000, impact: "avoided_maintenance_costs" },
            { amount: 775, impact: "avoided_illegal_dumping_costs" },
          ],
        },
        {
          amount: 89,
          impact: "water_regulation",
          impactCategory: "environmental_monetary",
          actor: "community",
        },
        {
          amount: 67490,
          impact: "ecosystem_services",
          impactCategory: "environmental_monetary",
          actor: "human_society",
          details: [
            { amount: 67522, impact: "carbon_storage" },
            { amount: -32, impact: "water_cycle" },
          ],
        },
        {
          actor: "human_society",
          amount: 80.32,
          impact: "avoided_air_conditioning_co2_eq_emissions",
          impactCategory: "environmental_monetary",
        },
        {
          actor: "local_people",
          amount: 1483.467913904975,
          impact: "avoided_air_conditioning_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "local_companies",
          amount: 56.00000000000001,
          impact: "avoided_air_conditioning_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "human_society",
          amount: 4322.77,
          impact: "avoided_traffic_co2_eq_emissions",
          impactCategory: "environmental_monetary",
        },
        {
          actor: "french_society",
          amount: 1794.5579568524333,
          impact: "avoided_air_pollution",
          impactCategory: "social_monetary",
        },
        {
          actor: "local_people",
          amount: 13388.877559948294,
          impact: "avoided_car_related_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "french_society",
          amount: 40.31586441279832,
          impact: "avoided_property_damages_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "local_people",
          amount: 53927.42350534729,
          impact: "travel_time_saved",
          impactCategory: "social_monetary",
        },
        {
          actor: "local_people",
          amount: 51946.349760072306,
          impact: "local_property_value_increase",
          impactCategory: "economic_indirect",
        },
        {
          actor: "community",
          amount: 91.4570582139455,
          impact: "local_transfer_duties_increase",
          impactCategory: "economic_indirect",
        },
      ],
      total: 231008.62664666667,
    },
    environmental: {
      permeableSurfaceArea: {
        base: 30000,
        forecast: 28750,
        difference: 28750 - 30000,
        greenSoil: { base: 5000, forecast: 24625, difference: 24625 - 5000 },
        mineralSoil: { base: 25000, forecast: 4125, difference: 4125 - 25000 },
      },
      nonContaminatedSurfaceArea: { current: 40000, forecast: 47500, difference: 7500 },
      soilsCarbonStorage: {
        isSuccess: true,
        current: {
          total: 173,
          soils: [
            { type: "BUILDINGS", surfaceArea: 5000, carbonStorage: 15 },
            { type: "IMPERMEABLE_SOILS", surfaceArea: 15000, carbonStorage: 45 },
            { type: "MINERAL_SOIL", surfaceArea: 25000, carbonStorage: 75 },
            { type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", surfaceArea: 5000, carbonStorage: 38 },
          ],
        },
        forecast: {
          total: 263.27,
          soils: [
            { type: "BUILDINGS", surfaceArea: 14625, carbonStorage: 43.875 },
            { type: "IMPERMEABLE_SOILS", surfaceArea: 6625, carbonStorage: 19.875 },
            { type: "MINERAL_SOIL", surfaceArea: 4125, carbonStorage: 12.375 },
            {
              type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surfaceArea: 24625,
              carbonStorage: 187.15,
            },
          ],
        },
      },
      avoidedAirConditioningCo2EqEmissions: 0.3941062183532509,

      avoidedCarTrafficCo2EqEmissions: 21.21086547497763,
    },
    social: {
      fullTimeJobs: {
        current: 0.1,
        forecast: 42.2,
        operations: { current: 0.1, forecast: 35.2 },
        conversion: { current: 0, forecast: 7 },
      },
      avoidedVehiculeKilometers: 134929.16968815288,
      travelTimeSaved: 5434.64711243949,
    },
  },
} as ReconversionProjectImpactsResult;

export const getImpactsDataFromEvaluationPeriod = (
  impactsDataFor1Year: ReconversionProjectImpactsResult["impacts"],
  evaluationPeriod: number,
): ReconversionProjectImpactsResult["impacts"] => {
  return {
    ...impactsDataFor1Year,
    socioeconomic: {
      ...impactsDataFor1Year.socioeconomic,
      impacts: impactsDataFor1Year.socioeconomic.impacts.map(({ amount, impact, ...rest }) => {
        switch (impact) {
          case "avoided_friche_costs":
          case "avoided_traffic_accidents":
          case "ecosystem_services": {
            const { details } = rest as
              | AvoidedFricheCostsImpact
              | AvoidedTrafficAccidentsImpact
              | EcosystemServicesImpact;
            return {
              ...rest,
              impact,
              amount: amount * evaluationPeriod,
              details: details.map(({ amount: amountDetails, ...restDetails }) => ({
                amount: amountDetails * evaluationPeriod,
                ...restDetails,
              })),
            };
          }
          default:
            return {
              ...rest,
              impact,
              amount: amount * evaluationPeriod,
            };
        }
      }),
    },
    avoidedAirConditioningCo2EqEmissions: impactsDataFor1Year.environmental
      .avoidedAirConditioningCo2EqEmissions
      ? impactsDataFor1Year.environmental.avoidedAirConditioningCo2EqEmissions * evaluationPeriod
      : undefined,
    avoidedVehiculeKilometers: impactsDataFor1Year.social.avoidedVehiculeKilometers
      ? impactsDataFor1Year.social.avoidedVehiculeKilometers * evaluationPeriod
      : undefined,
    travelTimeSaved: impactsDataFor1Year.social.travelTimeSaved
      ? impactsDataFor1Year.social.travelTimeSaved * evaluationPeriod
      : undefined,
    avoidedCarTrafficCo2EqEmissions: impactsDataFor1Year.environmental
      .avoidedCarTrafficCo2EqEmissions
      ? impactsDataFor1Year.environmental.avoidedCarTrafficCo2EqEmissions * evaluationPeriod
      : undefined,
  } as ReconversionProjectImpactsResult["impacts"];
};
