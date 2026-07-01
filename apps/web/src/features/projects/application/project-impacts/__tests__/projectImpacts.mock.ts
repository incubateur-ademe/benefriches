import {
  GetReconversionProjectImpactsResultDto,
  roundToInteger,
  SiteStatuQuoImpactMetric,
  sumListWithKey,
} from "shared";

const buildYearlySeries = (total: number, years: number) => {
  const perYear = roundToInteger(total / years);
  const detailsByYear = Array.from({ length: years }, () => perYear);
  const roundedSum = roundToInteger(perYear * years);
  detailsByYear[years - 1] = roundToInteger(detailsByYear[years - 1]! + (total - roundedSum));

  let cumulative = 0;
  const cumulativeByYear = detailsByYear.map((value) => {
    cumulative = roundToInteger(cumulative + value);
    return cumulative;
  });

  return { detailsByYear, cumulativeByYear };
};

const buildProjectionYears = (startYear: number, count: number): string[] =>
  Array.from({ length: count }, (_, index) => String(startYear + index));

const buildSiteStatuQuoEconomicImpacts = (
  years: number,
): GetReconversionProjectImpactsResultDto["impacts"]["reconversionImpactsBreakdown"]["siteStatuQuoIndirectEconomicImpactsData"] => {
  const details = [
    { name: "rentalIncome" as const, total: 540000, ...buildYearlySeries(540000, years) },

    {
      name: "fricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "accidentsCost" as const,
      total: 100000,
      ...buildYearlySeries(100000, years),
    },
    {
      name: "fricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "illegalDumpingCost" as const,
      total: 10000,
      ...buildYearlySeries(10000, years),
    },
    {
      name: "fricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "otherSecuringCosts" as const,
      total: 10000,
      ...buildYearlySeries(10000, years),
    },
    {
      name: "fricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "maintenance" as const,
      total: 1000,
      ...buildYearlySeries(1000, years),
    },
    {
      name: "fricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "security" as const,
      total: 10000,
      ...buildYearlySeries(10000, years),
    },

    { name: "waterRegulation" as const, total: 4720, ...buildYearlySeries(4720, years) },

    {
      name: "natureRelatedWelnessAndLeisure" as const,
      total: 1420,
      ...buildYearlySeries(1420, years),
    },
    { name: "pollination" as const, total: 1840, ...buildYearlySeries(1840, years) },
    {
      name: "invasiveSpeciesRegulation" as const,
      total: 680,
      ...buildYearlySeries(680, years),
    },
    { name: "waterCycle" as const, total: 19500, ...buildYearlySeries(19500, years) },
    { name: "nitrogenCycle" as const, total: 1380, ...buildYearlySeries(1380, years) },
    { name: "soilErosion" as const, total: 5000, ...buildYearlySeries(5000, years) },
  ];

  return { total: sumListWithKey(details, "total"), details };
};

const siteStatuQuoImpactMetrics: SiteStatuQuoImpactMetric[] = [
  { name: "fricheAccidentsDeaths", total: 0 },
  { name: "fricheAccidentsSevereInjuries", total: 2 },
  { name: "fricheAccidentsMinorInjuries", total: 1 },
  { name: "permeableGreenSurface", total: 40000 },
  { name: "permeableMineralSurface", total: 20000 },
  { name: "contaminatedSurface", total: 20000 },
  { name: "storedCo2Eq", total: 59 },
];

const aggregatedSiteStatuQuoImpactMetrics: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["impactsMetrics"] =
  [
    { name: "avoidedFricheAccidentsDeaths", total: 0 },
    { name: "avoidedFricheAccidentsSevereInjuries", total: 2 },
    { name: "avoidedFricheAccidentsMinorInjuries", total: 1 },
  ];

const buildAggregatedSiteStatuQuoIndirectEconomicImpacts = (years: number) => {
  const details = [
    { name: "oldRentalIncomeLoss" as const, total: -540000, ...buildYearlySeries(-540000, years) },
    {
      name: "avoidedFricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "accidentsCost" as const,
      total: 100000,
      ...buildYearlySeries(100000, years),
    },
    {
      name: "avoidedFricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "illegalDumpingCost" as const,
      total: 10000,
      ...buildYearlySeries(10000, years),
    },
    {
      name: "avoidedFricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "otherSecuringCosts" as const,
      total: 10000,
      ...buildYearlySeries(10000, years),
    },
    {
      name: "avoidedFricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "maintenance" as const,
      total: 1000,
      ...buildYearlySeries(1000, years),
    },
    {
      name: "avoidedFricheMaintenanceAndSecuringCostsForTenant" as const,
      details: "security" as const,
      total: 10000,
      ...buildYearlySeries(10000, years),
    },
    { name: "waterRegulation" as const, total: 4720, ...buildYearlySeries(4720, years) },
    {
      name: "natureRelatedWelnessAndLeisure" as const,
      total: 1420,
      ...buildYearlySeries(1420, years),
    },
    { name: "pollination" as const, total: 1840, ...buildYearlySeries(1840, years) },
    {
      name: "invasiveSpeciesRegulation" as const,
      total: 680,
      ...buildYearlySeries(680, years),
    },
    { name: "waterCycle" as const, total: 19500, ...buildYearlySeries(19500, years) },
    { name: "nitrogenCycle" as const, total: 1380, ...buildYearlySeries(1380, years) },
    { name: "soilErosion" as const, total: 5000, ...buildYearlySeries(5000, years) },
  ];

  return { total: sumListWithKey(details, "total"), details };
};

const oldOperationsFullTimeJobsLossMetric = {
  name: "oldOperationsFullTimeJobsLoss" as const,
  total: -1,
};

const buildPropertyTransferDutiesIncomeImpact = (years: number) => ({
  name: "propertyTransferDutiesIncome" as const,
  total: 5432,
  ...buildYearlySeries(5432, years),
});

const stakeholders: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"] = {
  current: {
    owner: { structureType: "municipality", structureName: "Mairie de Blajan" },
    tenant: { structureType: "unknown", structureName: "Current tenant" },
  },
  future: {},
  project: {
    developer: { structureType: "municipality", structureName: "Mairie de Blajan" },
    reinstatementContractOwner: { structureType: "unknown" },
  },
};

const photovoltaicYears = 20;

const photovoltaicEconomicBalance: GetReconversionProjectImpactsResultDto["impacts"]["projectEconomicBalance"] =
  (() => {
    const details = [
      {
        name: "projectOperatingEconomicBalance" as const,
        details: "taxes" as const,
        total: -10000,
        ...buildYearlySeries(-10000, photovoltaicYears),
      },
      {
        name: "projectOperatingEconomicBalance" as const,
        details: "maintenance" as const,
        total: -100000,
        ...buildYearlySeries(-100000, photovoltaicYears),
      },
      {
        name: "projectOperatingEconomicBalance" as const,
        details: "rent" as const,
        total: 100000,
        ...buildYearlySeries(100000, photovoltaicYears),
      },
      {
        name: "projectOperatingEconomicBalance" as const,
        details: "other" as const,
        total: 10000,
        ...buildYearlySeries(10000, photovoltaicYears),
      },
      { name: "siteReinstatement" as const, details: "demolition" as const, total: -500000 },
      { name: "sitePurchase" as const, total: -150000 },
      {
        name: "projectInstallation" as const,
        details: "installation_works" as const,
        total: -200000,
      },
      {
        name: "financialAssistanceRevenues" as const,
        details: "public_subsidies" as const,
        total: 150000,
      },
    ];
    return { total: sumListWithKey(details, "total"), details };
  })();

const photovoltaicProjectOnSiteIndirectEconomicImpacts: GetReconversionProjectImpactsResultDto["impacts"]["reconversionImpactsBreakdown"]["projectOnSiteIndirectEconomicImpactsData"] =
  (() => {
    const details = [
      buildPropertyTransferDutiesIncomeImpact(photovoltaicYears),
      {
        name: "projectPhotovoltaicTaxesIncome" as const,
        total: 5000,
        ...buildYearlySeries(5000, photovoltaicYears),
      },
      {
        name: "avoidedCo2eqWithEnergyProduction" as const,
        total: 168444,
        ...buildYearlySeries(168444, photovoltaicYears),
      },
    ];
    return { total: sumListWithKey(details, "total"), details };
  })();

const photovoltaicProjectIndirectImpactMetrics: GetReconversionProjectImpactsResultDto["impacts"]["reconversionImpactsBreakdown"]["projectIndirectImpactMetrics"] =
  [
    { name: "householdsPoweredByRenewableEnergy", total: 1000 },
    { name: "avoidedCO2TonsWithEnergyProduction", total: 112.3 },
    { name: "newPermeableGreenSurface", total: -10000 },
    { name: "newStoredCo2Eq", total: 0 },
    { name: "conversionFullTimeJobs", total: 3 },
    { name: "operationsFullTimeJobs", total: 0.5 },
    { name: "decontaminatedSurface", total: 20000 },
  ];

export const photovoltaicProjectImpactsResultDto = {
  projectionYears: buildProjectionYears(2024, photovoltaicYears),
  projectEconomicBalance: photovoltaicEconomicBalance,
  operationsFirstYear: 2024,
  stakeholders,
  aggregatedReconversionImpacts: {
    cumulativeBalanceByYear: buildYearlySeries(photovoltaicEconomicBalance.total, photovoltaicYears)
      .cumulativeByYear,
    indirectEconomicImpacts: (() => {
      const siteStatuQuo = buildAggregatedSiteStatuQuoIndirectEconomicImpacts(photovoltaicYears);
      const details = [
        ...siteStatuQuo.details,
        ...photovoltaicProjectOnSiteIndirectEconomicImpacts.details,
      ];
      return { total: sumListWithKey(details, "total"), details };
    })(),
    impactsMetrics: [
      ...aggregatedSiteStatuQuoImpactMetrics,
      oldOperationsFullTimeJobsLossMetric,
      ...photovoltaicProjectIndirectImpactMetrics,
    ],
  },
  reconversionImpactsBreakdown: {
    siteStatuQuoIndirectEconomicImpactsData: buildSiteStatuQuoEconomicImpacts(photovoltaicYears),
    projectOnSiteIndirectEconomicImpactsData: photovoltaicProjectOnSiteIndirectEconomicImpacts,
    projectIndirectImpactMetrics: photovoltaicProjectIndirectImpactMetrics,
    siteStatuQuoImpactMetrics,
  },
} satisfies GetReconversionProjectImpactsResultDto["impacts"];

export const photovoltaicProjectImpactMockMeta: GetReconversionProjectImpactsResultDto["contextData"] =
  {
    projectName: "Project photovoltaïque",
    projectId: "1b521325-ee61-40fb-8462-e01669ac767b",
    relatedSiteId: "68382abb-3a81-45e6-8af4-913767a28141",
    relatedSiteName: "Friche agricole de Blajan",
    isExpressSite: false,
    isExpressProject: false,
    siteAddress: {
      label: "Blajan",
      lat: 2.45,
      long: 45.26,
    },
    siteNature: "FRICHE",
    siteSurfaceArea: 90000,
    fricheActivity: "INDUSTRY",
    projectDevelopmentPlan: {
      type: "PHOTOVOLTAIC_POWER_PLANT" as const,
      installationElectricalPowerKWc: 1000,
      installationSurfaceArea: 2300,
    },
  };

const urbanYears = 50;

const urbanEconomicBalance: GetReconversionProjectImpactsResultDto["impacts"]["projectEconomicBalance"] =
  (() => {
    const details = [
      {
        name: "projectOperatingEconomicBalance" as const,
        details: "taxes" as const,
        total: -10000,
        ...buildYearlySeries(-10000, urbanYears),
      },
      {
        name: "projectOperatingEconomicBalance" as const,
        details: "maintenance" as const,
        total: -100000,
        ...buildYearlySeries(-100000, urbanYears),
      },
      { name: "siteReinstatement" as const, details: "demolition" as const, total: -500000 },
      { name: "sitePurchase" as const, total: -150000 },
      {
        name: "projectInstallation" as const,
        details: "development_works" as const,
        total: -200000,
      },
      { name: "siteResaleRevenue" as const, total: 1000000 },
    ];
    return { total: sumListWithKey(details, "total"), details };
  })();

const urbanProjectOnSiteIndirectEconomicImpacts: GetReconversionProjectImpactsResultDto["impacts"]["reconversionImpactsBreakdown"]["projectOnSiteIndirectEconomicImpactsData"] =
  (() => {
    const details = [
      buildPropertyTransferDutiesIncomeImpact(urbanYears),
      {
        name: "projectNewHousesTaxesIncome" as const,
        total: 160000,
        ...buildYearlySeries(160000, urbanYears),
      },
      {
        name: "projectNewCompanyTaxationIncome" as const,
        total: 8444,
        ...buildYearlySeries(8444, urbanYears),
      },
      {
        name: "avoidedTrafficCo2EqEmissions" as const,
        total: 150000,
        ...buildYearlySeries(150000, urbanYears),
      },
      {
        name: "avoidedAirConditioningCo2eqEmissions" as const,
        total: 200000,
        ...buildYearlySeries(200000, urbanYears),
      },
      {
        name: "avoidedAirPollutionHealthExpenses" as const,
        total: 1500,
        ...buildYearlySeries(1500, urbanYears),
      },
      {
        name: "avoidedCarRelatedExpenses" as const,
        total: 1155,
        ...buildYearlySeries(1155, urbanYears),
      },
      {
        name: "avoidedPropertyDamageExpenses" as const,
        total: 600,
        ...buildYearlySeries(600, urbanYears),
      },
      {
        name: "avoidedAirConditioningExpenses" as const,
        total: 1000,
        ...buildYearlySeries(1000, urbanYears),
      },
      {
        name: "avoidedAirConditioningExpenses" as const,
        total: 2000,
        ...buildYearlySeries(2000, urbanYears),
      },
      {
        name: "travelTimeSavedPerTravelerExpenses" as const,
        total: 10000,
        ...buildYearlySeries(10000, urbanYears),
      },
      {
        name: "avoidedAccidentsMinorInjuriesExpenses" as const,
        total: 1420,
        ...buildYearlySeries(1420, urbanYears),
      },
      {
        name: "avoidedAccidentsSevereInjuriesExpenses" as const,
        total: 1840,
        ...buildYearlySeries(1840, urbanYears),
      },
      {
        name: "avoidedAccidentsDeathsExpenses" as const,
        total: 680,
        ...buildYearlySeries(680, urbanYears),
      },
      {
        name: "localPropertyValueIncrease" as const,
        total: 150000,
        ...buildYearlySeries(150000, urbanYears),
      },
      {
        name: "localTransferDutiesIncrease" as const,
        total: 5000,
        ...buildYearlySeries(5000, urbanYears),
      },
    ];
    return { total: sumListWithKey(details, "total"), details };
  })();

const urbanProjectIndirectImpactMetrics: GetReconversionProjectImpactsResultDto["impacts"]["reconversionImpactsBreakdown"]["projectIndirectImpactMetrics"] =
  [
    { name: "avoidedVehiculeKilometers", total: 150000 },
    { name: "timeTravelSavedInHours", total: 555555 },
    { name: "avoidedTrafficAccidentsSevereInjuries", total: 10 },
    { name: "avoidedTrafficAccidentsMinorInjuries", total: 100 },
    { name: "avoidedTrafficCo2EqEmissions", total: 115 },
    { name: "avoidedAirConditioningCo2eqEmissions", total: 300 },
    { name: "newPermeableGreenSurface", total: 10000 },
    { name: "newPermeableMineralSurface", total: 40000 },
    { name: "newStoredCo2Eq", total: 59 },
    { name: "conversionFullTimeJobs", total: 3 },
    { name: "operationsFullTimeJobs", total: 0.5 },
    { name: "decontaminatedSurface", total: 20000 },
  ];

export const urbanProjectImpactsResultDto = {
  projectionYears: buildProjectionYears(2026, urbanYears),
  projectEconomicBalance: urbanEconomicBalance,
  operationsFirstYear: 2026,
  stakeholders,
  aggregatedReconversionImpacts: {
    cumulativeBalanceByYear: buildYearlySeries(urbanEconomicBalance.total, urbanYears)
      .cumulativeByYear,
    indirectEconomicImpacts: (() => {
      const siteStatuQuo = buildAggregatedSiteStatuQuoIndirectEconomicImpacts(urbanYears);
      const details = [
        ...siteStatuQuo.details,
        ...urbanProjectOnSiteIndirectEconomicImpacts.details,
      ];
      return { total: sumListWithKey(details, "total"), details };
    })(),
    impactsMetrics: [
      ...aggregatedSiteStatuQuoImpactMetrics,
      oldOperationsFullTimeJobsLossMetric,
      ...urbanProjectIndirectImpactMetrics,
    ],
  },
  reconversionImpactsBreakdown: {
    siteStatuQuoIndirectEconomicImpactsData: buildSiteStatuQuoEconomicImpacts(urbanYears),
    projectOnSiteIndirectEconomicImpactsData: urbanProjectOnSiteIndirectEconomicImpacts,
    projectIndirectImpactMetrics: urbanProjectIndirectImpactMetrics,
    siteStatuQuoImpactMetrics,
  },
} satisfies GetReconversionProjectImpactsResultDto["impacts"];

export const urbanProjectImpactMockMeta = {
  projectName: "Projet urbain",
  projectId: "5bd1c7cd-22e6-4c1c-8d50-41bca284ce05",
  relatedSiteId: "13958ec7-0468-4ecb-8217-0cc80a82b633",
  relatedSiteName: "Friche agricole de Blajan",
  isExpressSite: false,
  isExpressProject: false,
  siteAddress: {
    label: "Blajan",
    lat: 2.45,
    long: 45.26,
  },
  siteNature: "FRICHE" as const,
  siteSurfaceArea: 90000,
  fricheActivity: "INDUSTRY" as const,
  projectDevelopmentPlan: {
    type: "URBAN_PROJECT" as const,
    buildingsFloorAreaDistribution: {
      LOCAL_STORE: 20000,
      RESIDENTIAL: 70000,
    },
  },
};
