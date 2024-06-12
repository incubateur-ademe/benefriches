import { ReconversionProjectImpactsResult } from "./fetchReconversionProjectImpacts.action";

export const projectImpactMock = {
  id: "1b521325-ee61-40fb-8462-e01669ac767b",
  name: "Project photovoltaïque",
  relatedSiteId: "68382abb-3a81-45e6-8af4-913767a28141",
  relatedSiteName: "Friche agricole de Blajan",
  projectData: {
    soilsDistribution: {
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
      PRAIRIE_TREES: 20000,
      BUILDINGS: 20000,
      MINERAL_SOIL: 20000,
      IMPERMEABLE_SOILS: 30000,
    },
    contaminatedSoilSurface: 0,
    developmentPlan: {
      electricalPowerKWc: 258,
      surfaceArea: 20000,
    },
  },
  siteData: {
    addressLabel: "Blajan",
    contaminatedSoilSurface: 20000,
    soilsDistribution: {
      BUILDINGS: 20000,
      MINERAL_SOIL: 20000,
      PRAIRIE_TREES: 0,
      IMPERMEABLE_SOILS: 10000,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
    },
  },
  impacts: {
    socioeconomic: {
      total: -195584,
      impacts: [
        {
          actor: "Current owner",
          amount: -540000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
        {
          actor: "Current tenant",
          amount: 131000,
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
        },
        {
          actor: "community",
          amount: 5000,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
        {
          actor: "community",
          amount: 5432,
          impact: "property_transfer_duties_income",
          impactCategory: "economic_indirect",
        },
        {
          actor: "human_society",
          amount: 168444,
          impact: "avoided_co2_eq_with_enr",
          impactCategory: "environmental_monetary",
        },
        {
          actor: "community",
          amount: 4720,
          impact: "water_regulation",
          impactCategory: "environmental_monetary",
        },
        {
          actor: "human_society",
          amount: 29820,
          impact: "ecosystem_services",
          impactCategory: "environmental_monetary",
          details: [
            {
              amount: 1420,
              impact: "nature_related_wellness_and_leisure",
            },
            {
              amount: 1840,
              impact: "pollination",
            },
            {
              amount: 680,
              impact: "invasive_species_regulation",
            },
            {
              amount: 19500,
              impact: "water_cycle",
            },
            {
              amount: 1380,
              impact: "nitrogen_cycle",
            },
            {
              amount: 5000,
              impact: "soil_erosion",
            },
          ],
        },
      ],
    },
    economicBalance: {
      total: -500000,
      bearer: "Mairie de Blajan",
      costs: {
        total: 960000,
        operationsCosts: {
          total: 110000,
          costs: [
            { amount: 10000, purpose: "taxes" },
            { amount: 100000, purpose: "maintenance" },
          ],
        },
        siteReinstatement: {
          total: 500000,
          costs: [{ amount: 500000, purpose: "demolition" }],
        },
        developmentPlanInstallation: {
          total: 200000,
          costs: [{ amount: 200000, purpose: "installation_works" }],
        },
        realEstateTransaction: 150000,
      },
      revenues: {
        total: 460000,
        operationsRevenues: {
          total: 310000,
          revenues: [
            { amount: 100000, source: "rent" },
            { amount: 200000, source: "sell" },
            { amount: 10000, source: "other" },
          ],
        },
        financialAssistance: {
          total: 150000,
          revenues: [{ amount: 150000, source: "public_subsidies" }],
        },
      },
    },
    nonContaminatedSurfaceArea: {
      current: 30000,
      forecast: 50000,
    },
    permeableSurfaceArea: {
      base: 60000,
      forecast: 50000,
      greenSoil: {
        base: 40000,
        forecast: 30000,
      },
      mineralSoil: {
        base: 20000,
        forecast: 20000,
      },
    },
    fullTimeJobs: {
      current: 1,
      forecast: 3.5,
      conversion: {
        current: 0,
        forecast: 3,
      },
      operations: {
        current: 1,
        forecast: 0.5,
      },
    },
    accidents: {
      current: 3,
      forecast: 0,
      deaths: {
        current: 0,
        forecast: 0,
      },
      severeInjuries: {
        current: 2,
        forecast: 0,
      },
      minorInjuries: {
        current: 1,
        forecast: 0,
      },
    },
    householdsPoweredByRenewableEnergy: {
      current: 0,
      forecast: 1000,
    },
    avoidedCO2TonsWithEnergyProduction: {
      current: 0,
      forecast: 112.29599999999999,
    },
    soilsCarbonStorage: {
      current: {
        total: 20,
        soils: [
          {
            type: "IMPERMEABLE_SOILS",
            carbonStorage: 2,
            surfaceArea: 1000,
          },
          {
            type: "BUILDINGS",
            carbonStorage: 2,
            surfaceArea: 1000,
          },
          {
            type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            carbonStorage: 16,
            surfaceArea: 1000,
          },
        ],
      },
      forecast: {
        total: 20,
        soils: [
          {
            type: "IMPERMEABLE_SOILS",
            carbonStorage: 2,
            surfaceArea: 1000,
          },
          {
            type: "BUILDINGS",
            carbonStorage: 2,
            surfaceArea: 1000,
          },
          {
            type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            carbonStorage: 16,
            surfaceArea: 1000,
          },
        ],
      },
    },
  },
} as ReconversionProjectImpactsResult;
