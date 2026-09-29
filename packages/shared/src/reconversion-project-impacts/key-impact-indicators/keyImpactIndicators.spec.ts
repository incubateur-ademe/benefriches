import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import { siteNatureSchema } from "../../site";
import type { KeyImpactIndicatorData } from "./keyImpactIndicators";
import { getKeyImpactIndicatorsList, getSummaryHeadlineIndicators } from "./keyImpactIndicators";

type Impacts = GetReconversionProjectImpactsResultDto["impacts"];
type Context = GetReconversionProjectImpactsResultDto["contextData"];

const buildImpacts = ({
  impactsMetrics = [],
  indirectEconomicImpacts = { total: 0, details: [] },
  economicBalanceTotal = 0,
  currentStakeholders = { owner: { structureType: "unknown" } },
  siteStatuQuoImpactMetrics = [],
  projectIndirectImpactMetrics = [],
}: {
  impactsMetrics?: Impacts["aggregatedReconversionImpacts"]["impactsMetrics"];
  indirectEconomicImpacts?: Impacts["aggregatedReconversionImpacts"]["indirectEconomicImpacts"];
  economicBalanceTotal?: number;
  currentStakeholders?: Impacts["stakeholders"]["current"];
  siteStatuQuoImpactMetrics?: Impacts["reconversionImpactsBreakdown"]["siteStatuQuoImpactMetrics"];
  projectIndirectImpactMetrics?: Impacts["reconversionImpactsBreakdown"]["projectIndirectImpactMetrics"];
} = {}): Impacts => ({
  projectionYears: ["2026", "2027"],
  operationsFirstYear: 2026,
  projectEconomicBalance: { total: economicBalanceTotal, details: [] },
  stakeholders: {
    current: currentStakeholders,
    future: {},
    project: {
      developer: { structureType: "unknown" },
      reinstatementContractOwner: { structureType: "unknown" },
    },
  },
  aggregatedReconversionImpacts: {
    cumulativeBalanceByYear: [],
    cumulativeEconomicBalanceByYear: [],
    cumulativeIndirectEconomicImpactsByYear: [],
    indirectEconomicImpacts,
    impactsMetrics,
  },
  reconversionImpactsBreakdown: {
    siteStatuQuoIndirectEconomicImpactsData: { total: 0, details: [] },
    projectOnSiteIndirectEconomicImpactsData: { total: 0, details: [] },
    projectIndirectImpactMetrics,
    siteStatuQuoImpactMetrics,
  },
});

const buildContext = (overrides: Partial<Context> = {}): Context => ({
  projectId: "5bd1c7cd-22e6-4c1c-8d50-41bca284ce05",
  projectName: "Projet urbain",
  relatedSiteId: "13958ec7-0468-4ecb-8217-0cc80a82b633",
  relatedSiteName: "Friche de Blajan",
  isExpressSite: false,
  isExpressProject: false,
  projectDevelopmentPlan: { type: "URBAN_PROJECT", buildingsFloorAreaDistribution: {} },
  siteAddress: { label: "Blajan", lat: 43.26, long: 0.65 },
  siteNature: "FRICHE",
  siteSurfaceArea: 10000,
  fricheActivity: "INDUSTRY",
  municipalityCapitalExpenditures: { amount: 1000000, referenceYear: "2025" },
  ...overrides,
});

const zanComplianceOnIndustrialFriche = {
  name: "zanCompliance",
  isSuccess: true,
  value: {
    isAgriculturalFriche: false,
    permeableSurfaceAreaDifference: undefined,
    artificializedSurfaceArea: 0,
  },
} as const;

describe("getKeyImpactIndicatorsList", () => {
  describe("ZAN compliance", () => {
    it("reports ZAN compliance for a non-agricultural friche", () => {
      const impacts = buildImpacts();
      const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

      const indicators = getKeyImpactIndicatorsList(impacts, context);

      assert.deepStrictEqual(indicators, [
        {
          name: "zanCompliance",
          isSuccess: true,
          value: {
            isAgriculturalFriche: false,
            permeableSurfaceAreaDifference: undefined,
            artificializedSurfaceArea: 0,
          },
        },
      ]);
    });

    it("reports ZAN non-compliance for an agricultural friche", () => {
      const impacts = buildImpacts();
      const context = buildContext({ siteNature: "FRICHE", fricheActivity: "AGRICULTURE" });

      const indicators = getKeyImpactIndicatorsList(impacts, context);

      assert.deepStrictEqual(indicators, [
        {
          name: "zanCompliance",
          isSuccess: false,
          value: {
            isAgriculturalFriche: true,
            permeableSurfaceAreaDifference: undefined,
            artificializedSurfaceArea: 0,
          },
        },
      ]);
    });

    for (const nature of siteNatureSchema.options.filter((n) => n !== "FRICHE")) {
      it(`is not ZAN compliant on a ${nature} site`, () => {
        const impacts = buildImpacts();
        const context = buildContext({ siteNature: nature, fricheActivity: undefined });

        const indicators = getKeyImpactIndicatorsList(impacts, context);

        assert.deepStrictEqual(indicators, [
          {
            name: "zanCompliance",
            isSuccess: false,
            value: { permeableSurfaceAreaDifference: undefined, artificializedSurfaceArea: 0 },
          },
        ]);
      });
    }

    it("counts lost permeable surface as artificialised in the ZAN indicator", () => {
      const impacts = buildImpacts({
        impactsMetrics: [
          { name: "newPermeableGreenSurface", total: -300 },
          { name: "newPermeableMineralSurface", total: -200 },
        ],
      });
      const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

      const indicators = getKeyImpactIndicatorsList(impacts, context);

      assert.deepStrictEqual(indicators, [
        {
          name: "zanCompliance",
          isSuccess: true,
          value: {
            isAgriculturalFriche: false,
            permeableSurfaceAreaDifference: -500,
            artificializedSurfaceArea: 500,
          },
        },
      ]);
    });
  });

  describe("project balance", () => {
    it("adds the project balance when the economic balance is negative", () => {
      const impacts = buildImpacts({
        economicBalanceTotal: -700000,
        indirectEconomicImpacts: { total: 900000, details: [] },
      });
      const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

      const indicators = getKeyImpactIndicatorsList(impacts, context);

      assert.deepStrictEqual(indicators, [
        zanComplianceOnIndustrialFriche,
        {
          name: "projectImpactBalance",
          isSuccess: true,
          value: {
            economicBalanceTotal: -700000,
            socioEconomicMonetaryImpactsTotal: 900000,
            projectBalance: 200000,
          },
        },
      ]);
    });

    it("omits the project balance when the economic balance is not negative", () => {
      const impacts = buildImpacts({
        economicBalanceTotal: 0,
        indirectEconomicImpacts: { total: 900000, details: [] },
      });
      const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

      const indicators = getKeyImpactIndicatorsList(impacts, context);

      assert.deepStrictEqual(indicators, [zanComplianceOnIndustrialFriche]);
    });
  });

  describe("avoided friche costs for the local authority", () => {
    it("attributes avoided friche costs to a local-authority owner", () => {
      const impacts = buildImpacts({
        currentStakeholders: {
          owner: { structureType: "municipality", structureName: "Mairie de Blajan" },
        },
        indirectEconomicImpacts: {
          total: 120000,
          details: [
            {
              name: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
              details: "security",
              total: 120000,
              detailsByYear: [60000, 60000],
              cumulativeByYear: [60000, 120000],
            },
          ],
        },
      });
      const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

      const indicators = getKeyImpactIndicatorsList(impacts, context);

      assert.deepStrictEqual(indicators, [
        zanComplianceOnIndustrialFriche,
        {
          name: "avoidedFricheCostsForLocalAuthority",
          isSuccess: true,
          value: {
            total: 120000,
            details: [
              {
                impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
                amount: 120000,
                bearerName: "Mairie de Blajan",
              },
            ],
          },
        },
      ]);
    });

    it("adds a local-authority tenant's avoided costs to the owner's", () => {
      const impacts = buildImpacts({
        currentStakeholders: {
          owner: { structureType: "municipality", structureName: "Mairie de Blajan" },
          tenant: { structureType: "epci", structureName: "CC Blajan" },
        },
        indirectEconomicImpacts: {
          total: 150000,
          details: [
            {
              name: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
              details: "security",
              total: 120000,
              detailsByYear: [60000, 60000],
              cumulativeByYear: [60000, 120000],
            },
            {
              name: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
              details: "maintenance",
              total: 30000,
              detailsByYear: [15000, 15000],
              cumulativeByYear: [15000, 30000],
            },
          ],
        },
      });
      const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

      const indicators = getKeyImpactIndicatorsList(impacts, context);

      assert.deepStrictEqual(indicators, [
        zanComplianceOnIndustrialFriche,
        {
          name: "avoidedFricheCostsForLocalAuthority",
          isSuccess: true,
          value: {
            total: 150000,
            details: [
              {
                impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
                amount: 120000,
                bearerName: "Mairie de Blajan",
              },
              {
                impactName: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
                amount: 30000,
                bearerName: "CC Blajan",
              },
            ],
          },
        },
      ]);
    });

    it("omits avoided friche costs when no current stakeholder is a local authority", () => {
      const impacts = buildImpacts({
        currentStakeholders: {
          owner: { structureType: "unknown" },
          tenant: { structureType: "company", structureName: "Locataire" },
        },
        indirectEconomicImpacts: {
          total: 150000,
          details: [
            {
              name: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
              details: "security",
              total: 120000,
              detailsByYear: [60000, 60000],
              cumulativeByYear: [60000, 120000],
            },
            {
              name: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
              details: "maintenance",
              total: 30000,
              detailsByYear: [15000, 15000],
              cumulativeByYear: [15000, 30000],
            },
          ],
        },
      });
      const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

      const indicators = getKeyImpactIndicatorsList(impacts, context);

      assert.deepStrictEqual(indicators, [zanComplianceOnIndustrialFriche]);
    });
  });

  it("sums the tax incomes", () => {
    const impacts = buildImpacts({
      indirectEconomicImpacts: {
        total: 11499,
        details: [
          {
            name: "projectNewHousesTaxesIncome",
            total: 1000,
            detailsByYear: [500, 500],
            cumulativeByYear: [500, 1000],
          },
          {
            name: "propertyTransferDutiesIncome",
            total: 500,
            detailsByYear: [500, 0],
            cumulativeByYear: [500, 500],
          },
          {
            name: "projectedRentalIncome",
            total: 9999,
            detailsByYear: [5000, 4999],
            cumulativeByYear: [5000, 9999],
          },
        ],
      },
    });
    const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [
      zanComplianceOnIndustrialFriche,
      { name: "taxesIncomesImpact", isSuccess: true, value: 1500 },
    ]);
  });

  it("adds the local property value increase", () => {
    const impacts = buildImpacts({
      indirectEconomicImpacts: {
        total: 5000,
        details: [
          {
            name: "localPropertyValueIncrease",
            total: 5000,
            detailsByYear: [2500, 2500],
            cumulativeByYear: [2500, 5000],
          },
        ],
      },
    });
    const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [
      zanComplianceOnIndustrialFriche,
      { name: "localPropertyValueIncrease", isSuccess: true, value: 5000 },
    ]);
  });

  it("omits a zero local property value increase", () => {
    const impacts = buildImpacts({
      indirectEconomicImpacts: {
        total: 0,
        details: [
          {
            name: "localPropertyValueIncrease",
            total: 0,
            detailsByYear: [0, 0],
            cumulativeByYear: [0, 0],
          },
        ],
      },
    });
    const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [zanComplianceOnIndustrialFriche]);
  });

  it("computes the full-time jobs difference and its evolution", () => {
    const impacts = buildImpacts({
      impactsMetrics: [
        { name: "conversionFullTimeJobs", total: 10 },
        { name: "oldOperationsFullTimeJobsLoss", total: -4 },
      ],
    });
    const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [
      zanComplianceOnIndustrialFriche,
      { name: "fullTimeJobs", isSuccess: true, value: { difference: 6, percentageEvolution: -50 } },
    ]);
  });

  it("adds the households powered by renewable energy", () => {
    const impacts = buildImpacts({
      impactsMetrics: [{ name: "householdsPoweredByRenewableEnergy", total: 250 }],
    });
    const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [
      zanComplianceOnIndustrialFriche,
      { name: "householdsPoweredByRenewableEnergy", isSuccess: true, value: 250 },
    ]);
  });

  it("omits zero households powered by renewable energy", () => {
    const impacts = buildImpacts({
      impactsMetrics: [{ name: "householdsPoweredByRenewableEnergy", total: 0 }],
    });
    const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [zanComplianceOnIndustrialFriche]);
  });

  it("sums the avoided CO2eq emissions", () => {
    const impacts = buildImpacts({
      impactsMetrics: [
        { name: "avoidedCO2TonsWithEnergyProduction", total: 100 },
        { name: "newStoredCo2Eq", total: 20 },
        { name: "avoidedVehiculeKilometers", total: 5000 },
      ],
    });
    const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [
      zanComplianceOnIndustrialFriche,
      { name: "avoidedCo2eqEmissions", isSuccess: true, value: 120 },
    ]);
  });

  it("adds the gained permeable surface and its evolution from the site's", () => {
    const impacts = buildImpacts({
      impactsMetrics: [{ name: "newPermeableGreenSurface", total: 300 }],
      siteStatuQuoImpactMetrics: [{ name: "permeableGreenSurface", total: 1000 }],
    });
    const context = buildContext({ siteNature: "FRICHE", fricheActivity: "INDUSTRY" });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [
      {
        name: "zanCompliance",
        isSuccess: true,
        value: {
          isAgriculturalFriche: false,
          permeableSurfaceAreaDifference: 300,
          artificializedSurfaceArea: 0,
        },
      },
      {
        name: "permeableSurfaceArea",
        isSuccess: true,
        value: { difference: 300, percentageEvolution: 30 },
      },
    ]);
  });

  it("adds the non-contaminated surface when the project decontaminates a contaminated site", () => {
    const impacts = buildImpacts({
      siteStatuQuoImpactMetrics: [{ name: "contaminatedSurface", total: 2000 }],
      projectIndirectImpactMetrics: [{ name: "decontaminatedSurface", total: 500 }],
    });
    const context = buildContext({
      siteNature: "FRICHE",
      fricheActivity: "INDUSTRY",
      siteSurfaceArea: 10000,
    });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [
      zanComplianceOnIndustrialFriche,
      {
        name: "nonContaminatedSurfaceArea",
        isSuccess: true,
        value: {
          percentageEvolution: -6.25,
          forecastContaminatedSurfaceArea: 2500,
          decontaminatedSurfaceArea: 500,
        },
      },
    ]);
  });

  it("omits the non-contaminated surface when the site has no contaminated surface", () => {
    const impacts = buildImpacts({
      siteStatuQuoImpactMetrics: [],
      projectIndirectImpactMetrics: [{ name: "decontaminatedSurface", total: 500 }],
    });
    const context = buildContext({
      siteNature: "FRICHE",
      fricheActivity: "INDUSTRY",
      siteSurfaceArea: 10000,
    });

    const indicators = getKeyImpactIndicatorsList(impacts, context);

    assert.deepStrictEqual(indicators, [zanComplianceOnIndustrialFriche]);
  });
});

describe("getSummaryHeadlineIndicators", () => {
  const zan: KeyImpactIndicatorData = {
    name: "zanCompliance",
    isSuccess: true,
    value: { isAgriculturalFriche: false, artificializedSurfaceArea: 0 },
  };
  const avoidedFricheCosts: KeyImpactIndicatorData = {
    name: "avoidedFricheCostsForLocalAuthority",
    isSuccess: true,
    value: {
      total: 120000,
      details: [
        {
          impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
          amount: 120000,
          bearerName: "Mairie de Blajan",
        },
      ],
    },
  };
  const taxes: KeyImpactIndicatorData = {
    name: "taxesIncomesImpact",
    isSuccess: true,
    value: 1500,
  };
  const projectImpactBalance: KeyImpactIndicatorData = {
    name: "projectImpactBalance",
    isSuccess: true,
    value: {
      economicBalanceTotal: -700000,
      socioEconomicMonetaryImpactsTotal: 900000,
      projectBalance: 200000,
    },
  };

  it("picks the ZAN indicator and the highest-priority other indicator", () => {
    const headlines = getSummaryHeadlineIndicators([taxes, avoidedFricheCosts, zan]);

    assert.deepStrictEqual(headlines, {
      zanCompliance: zan,
      mainImpactIndicator: avoidedFricheCosts,
    });
  });

  it("never picks the project balance as the main indicator", () => {
    const headlines = getSummaryHeadlineIndicators([projectImpactBalance, taxes, zan]);

    assert.deepStrictEqual(headlines, { zanCompliance: zan, mainImpactIndicator: taxes });
  });

  it("has no main indicator when only ZAN and the balance exist", () => {
    const headlines = getSummaryHeadlineIndicators([zan, projectImpactBalance]);

    assert.deepStrictEqual(headlines, { zanCompliance: zan, mainImpactIndicator: undefined });
  });
});
