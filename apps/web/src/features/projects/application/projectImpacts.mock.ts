import { ReconversionProjectImpactsResult } from "./fetchReconversionProjectImpacts.action";

const siteData = {
  owner: { name: "Mairie de Blajan", structureType: "municipality" },
  surfaceArea: 90000,
  fricheActivity: "INDUSTRY",
  isFriche: true,
  addressLabel: "Blajan",
  contaminatedSoilSurface: 20000,
  soilsDistribution: {
    BUILDINGS: 20000,
    MINERAL_SOIL: 20000,
    PRAIRIE_TREES: 0,
    IMPERMEABLE_SOILS: 10000,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
  },
} satisfies ReconversionProjectImpactsResult["siteData"];

const baseImpacts = {
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
        details: [
          { amount: 100000, impact: "avoided_accidents_costs" },
          { amount: 10000, impact: "avoided_illegal_dumping_costs" },
          { amount: 10000, impact: "avoided_other_securing_costs" },
          { amount: 1000, impact: "avoided_maintenance_costs" },
          { amount: 10000, impact: "avoided_security_costs" },
        ],
      },
      {
        actor: "community",
        amount: 5432,
        impact: "property_transfer_duties_income",
        impactCategory: "economic_direct",
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
      sitePurchase: 150000,
    },
    revenues: {
      total: 460000,
      operationsRevenues: {
        total: 310000,
        revenues: [
          { amount: 100000, source: "rent" },
          { amount: 10000, source: "other" },
        ],
      },
      financialAssistance: {
        total: 150000,
        revenues: [{ amount: 150000, source: "public_subsidies" }],
      },
    },
  },
  environmental: {
    nonContaminatedSurfaceArea: {
      current: 30000,
      forecast: 50000,
      difference: 20000,
    },
    permeableSurfaceArea: {
      base: 60000,
      forecast: 50000,
      difference: -10000,
      greenSoil: {
        base: 40000,
        forecast: 30000,
        difference: -10000,
      },
      mineralSoil: {
        base: 20000,
        forecast: 20000,
        difference: 0,
      },
    },

    soilsCarbonStorage: {
      isSuccess: true,
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
  social: {
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
  },
} satisfies ReconversionProjectImpactsResult["impacts"];

export const photovoltaicProjectImpactMock = {
  name: "Project photovoltaïque",
  id: "1b521325-ee61-40fb-8462-e01669ac767b",
  relatedSiteId: "68382abb-3a81-45e6-8af4-913767a28141",
  relatedSiteName: "Friche agricole de Blajan",
  siteData,
  isExpressSite: false,
  projectData: {
    contaminatedSoilSurface: 0,
    isExpressProject: false,
    soilsDistribution: {
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
      PRAIRIE_TREES: 20000,
      BUILDINGS: 20000,
      MINERAL_SOIL: 20000,
      IMPERMEABLE_SOILS: 30000,
    },
    developmentPlan: {
      type: "PHOTOVOLTAIC_POWER_PLANT",
      electricalPowerKWc: 1000,
      surfaceArea: 2300,
    },
  },
  impacts: {
    ...baseImpacts,
    economicBalance: {
      ...baseImpacts.economicBalance,
      costs: {
        ...baseImpacts.economicBalance.costs,
        developmentPlanInstallation: {
          total: 200000,
          costs: [{ amount: 200000, purpose: "installation_works" }],
        },
      },
    },
    socioeconomic: {
      total: baseImpacts.socioeconomic.total + 168444,
      impacts: [
        ...baseImpacts.socioeconomic.impacts,
        {
          actor: "community",
          amount: 5000,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
          details: [
            {
              impact: "project_photovoltaic_taxes_income",
              amount: 5000,
            },
          ],
        },
        {
          actor: "human_society",
          amount: 168444,
          impact: "avoided_co2_eq_emissions",
          impactCategory: "environmental_monetary",
          details: [
            {
              impact: "avoided_co2_eq_with_enr",
              amount: 168444,
            },
          ],
        },
      ],
    },
    social: {
      ...baseImpacts.social,
      householdsPoweredByRenewableEnergy: {
        current: 0,
        forecast: 1000,
      },
    },
    environmental: {
      ...baseImpacts.environmental,
      avoidedCO2TonsWithEnergyProduction: {
        current: 0,
        forecast: 112.29599999999999,
      },
    },
  },
} satisfies ReconversionProjectImpactsResult;

export const urbanProjectImpactMock = {
  name: "Projet urbain",
  id: "5bd1c7cd-22e6-4c1c-8d50-41bca284ce05",
  relatedSiteId: "13958ec7-0468-4ecb-8217-0cc80a82b633",
  relatedSiteName: "Friche agricole de Blajan",
  siteData,
  isExpressSite: false,
  projectData: {
    contaminatedSoilSurface: 0,
    isExpressProject: false,
    soilsDistribution: {
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
      PRAIRIE_TREES: 20000,
      BUILDINGS: 20000,
      MINERAL_SOIL: 20000,
      IMPERMEABLE_SOILS: 30000,
    },
    developmentPlan: {
      type: "URBAN_PROJECT",
      buildingsFloorAreaDistribution: {
        GROUND_FLOOR_RETAIL: 20000,
        RESIDENTIAL: 70000,
      },
    },
  },
  impacts: {
    ...baseImpacts,
    economicBalance: {
      total: -500000,
      costs: {
        ...baseImpacts.economicBalance.costs,
        developmentPlanInstallation: {
          total: 200000,
          costs: [{ amount: 200000, purpose: "development_works" }],
        },
      },
      revenues: {
        total: 1000000,
        siteResale: 1000000,
      },
    },
    socioeconomic: {
      total: baseImpacts.socioeconomic.total + 168444,
      impacts: [
        ...baseImpacts.socioeconomic.impacts,
        {
          actor: "community",
          amount: 168444,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
          details: [
            {
              impact: "project_new_houses_taxes_income",
              amount: 160000,
            },
            {
              impact: "project_new_company_taxation_income",
              amount: 8444,
            },
          ],
        },
        {
          amount: 350000,
          impact: "avoided_co2_eq_emissions",
          impactCategory: "environmental_monetary",
          actor: "human_society",
          details: [
            {
              impact: "avoided_traffic_co2_eq_emissions",
              amount: 150000,
            },
            {
              amount: 200000,
              impact: "avoided_air_conditioning_co2_eq_emissions",
            },
          ],
        },

        {
          amount: 1500,
          impact: "avoided_air_pollution",
          impactCategory: "social_monetary",
          actor: "human_society",
        },
        {
          actor: "local_people",
          amount: 1155,
          impact: "avoided_car_related_expenses",
          impactCategory: "economic_indirect",
        },
        {
          impact: "avoided_property_damages_expenses",
          amount: 600,
          impactCategory: "economic_indirect",
          actor: "french_society",
        },
        {
          actor: "local_people",
          amount: 1000,
          impact: "avoided_air_conditioning_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "local_companies",
          amount: 2000,
          impact: "avoided_air_conditioning_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "local_people",
          amount: 10000,
          impact: "travel_time_saved",
          impactCategory: "social_monetary",
        },
        {
          actor: "french_society",
          amount: 10000,
          impact: "avoided_traffic_accidents",
          impactCategory: "social_monetary",
          details: [
            {
              amount: 1420,
              impact: "avoided_traffic_minor_injuries",
            },
            {
              amount: 1840,
              impact: "avoided_traffic_severe_injuries",
            },
            {
              amount: 680,
              impact: "avoided_traffic_deaths",
            },
          ],
        },
        {
          amount: 150000,
          impact: "local_property_value_increase",
          impactCategory: "economic_indirect",
          actor: "local_people",
        },
        {
          amount: 5000,
          impact: "local_transfer_duties_increase",
          impactCategory: "economic_indirect",
          actor: "community",
        },
      ],
    },
    social: {
      ...baseImpacts.social,
      avoidedVehiculeKilometers: 150000,
      travelTimeSaved: 555555,
      avoidedTrafficAccidents: {
        total: 1000,
        minorInjuries: 500,
        severeInjuries: 500,
        deaths: 80,
      },
    },
    environmental: {
      ...baseImpacts.environmental,
      avoidedCarTrafficCo2EqEmissions: 115,
      avoidedAirConditioningCo2EqEmissions: 300,
    },
  },
} satisfies ReconversionProjectImpactsResult;
