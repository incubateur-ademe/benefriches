import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  GetReconversionProjectImpactsResultDto,
  UrbanSprawlImpactsComparisonResultDto,
} from "../../api-dtos";
import {
  cropImpactsByEvaluationPeriod,
  cropUrbanSprawlSimulationByEvaluationPeriod,
} from "./cropImpactsByEvaluationPeriod";

type Impacts = GetReconversionProjectImpactsResultDto["impacts"];

const stakeholders: Impacts["stakeholders"] = {
  current: { owner: { structureType: "municipality", structureName: "Mairie de Blajan" } },
  future: {},
  project: {
    developer: { structureType: "unknown" },
    reinstatementContractOwner: { structureType: "unknown" },
  },
};

// A 3-year impacts result; each test sets the lists its assertion depends on.
const buildImpacts = ({
  projectionYears = ["2026", "2027", "2028"],
  breakEvenYear,
  cumulativeBalanceByYear = [0, 0, 0],
  cumulativeEconomicBalanceByYear = [0, 0, 0],
  cumulativeIndirectEconomicImpactsByYear = [0, 0, 0],
  indirectEconomicImpacts = { total: 0, details: [] },
  impactsMetrics = [],
  projectEconomicBalance = { total: 0, details: [] },
  breakdown = {},
}: {
  projectionYears?: string[];
  breakEvenYear?: string;
  cumulativeBalanceByYear?: number[];
  cumulativeEconomicBalanceByYear?: number[];
  cumulativeIndirectEconomicImpactsByYear?: number[];
  indirectEconomicImpacts?: Impacts["aggregatedReconversionImpacts"]["indirectEconomicImpacts"];
  impactsMetrics?: Impacts["aggregatedReconversionImpacts"]["impactsMetrics"];
  projectEconomicBalance?: Impacts["projectEconomicBalance"];
  breakdown?: Partial<Impacts["reconversionImpactsBreakdown"]>;
} = {}): Impacts => ({
  projectionYears,
  operationsFirstYear: 2026,
  stakeholders,
  projectEconomicBalance,
  aggregatedReconversionImpacts: {
    breakEvenYear,
    cumulativeBalanceByYear,
    cumulativeEconomicBalanceByYear,
    cumulativeIndirectEconomicImpactsByYear,
    indirectEconomicImpacts,
    impactsMetrics,
  },
  reconversionImpactsBreakdown: {
    siteStatuQuoIndirectEconomicImpactsData: { total: 0, details: [] },
    projectOnSiteIndirectEconomicImpactsData: { total: 0, details: [] },
    projectIndirectImpactMetrics: [],
    siteStatuQuoImpactMetrics: [],
    ...breakdown,
  },
});

describe("cropImpactsByEvaluationPeriod", () => {
  it("keeps the first years of the projection and the cumulative series", () => {
    const impacts = buildImpacts({
      projectionYears: ["2026", "2027", "2028"],
      cumulativeBalanceByYear: [-100, 50, 200],
      cumulativeEconomicBalanceByYear: [-300, -300, -300],
      cumulativeIndirectEconomicImpactsByYear: [200, 350, 500],
    });

    const cropped = cropImpactsByEvaluationPeriod(impacts, 2);

    assert.deepStrictEqual(
      {
        projectionYears: cropped.projectionYears,
        cumulativeBalanceByYear: cropped.aggregatedReconversionImpacts.cumulativeBalanceByYear,
        cumulativeEconomicBalanceByYear:
          cropped.aggregatedReconversionImpacts.cumulativeEconomicBalanceByYear,
        cumulativeIndirectEconomicImpactsByYear:
          cropped.aggregatedReconversionImpacts.cumulativeIndirectEconomicImpactsByYear,
      },
      {
        projectionYears: ["2026", "2027"],
        cumulativeBalanceByYear: [-100, 50],
        cumulativeEconomicBalanceByYear: [-300, -300],
        cumulativeIndirectEconomicImpactsByYear: [200, 350],
      },
    );
  });

  it("re-sums each indirect economic impact and the total over the kept years", () => {
    const impacts = buildImpacts({
      indirectEconomicImpacts: {
        total: 300,
        details: [
          {
            name: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
            details: "security",
            total: 300,
            detailsByYear: [100, 100, 100],
            cumulativeByYear: [100, 200, 300],
          },
        ],
      },
    });

    const cropped = cropImpactsByEvaluationPeriod(impacts, 2);

    assert.deepStrictEqual(cropped.aggregatedReconversionImpacts.indirectEconomicImpacts, {
      total: 200,
      details: [
        {
          name: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
          details: "security",
          total: 200,
          detailsByYear: [100, 100],
          cumulativeByYear: [100, 200],
        },
      ],
    });
  });

  it("crops only the operating lines of the economic balance", () => {
    const impacts = buildImpacts({
      projectEconomicBalance: {
        total: -850,
        details: [
          {
            name: "projectOperatingRevenues",
            details: "rent",
            total: 150,
            detailsByYear: [50, 50, 50],
            cumulativeByYear: [50, 100, 150],
          },
          { name: "siteReinstatement", details: "waste_collection", total: -1000 },
        ],
      },
    });

    const cropped = cropImpactsByEvaluationPeriod(impacts, 2);

    assert.deepStrictEqual(cropped.projectEconomicBalance, {
      total: -900,
      details: [
        {
          name: "projectOperatingRevenues",
          details: "rent",
          total: 100,
          detailsByYear: [50, 50],
          cumulativeByYear: [50, 100],
        },
        { name: "siteReinstatement", details: "waste_collection", total: -1000 },
      ],
    });
  });

  it("rescales conversion and reinstatement jobs to the new period", () => {
    const impacts = buildImpacts({
      projectionYears: ["2026", "2027", "2028"],
      impactsMetrics: [
        { name: "conversionFullTimeJobs", total: 30 },
        { name: "reinstatementFullTimeJobs", total: 10 },
      ],
    });

    const cropped = cropImpactsByEvaluationPeriod(impacts, 2);

    assert.deepStrictEqual(cropped.aggregatedReconversionImpacts.impactsMetrics, [
      { name: "conversionFullTimeJobs", total: 45 },
      { name: "reinstatementFullTimeJobs", total: 15 },
    ]);
  });

  it("re-sums yearly metrics and leaves soils distribution and metrics without yearly details untouched", () => {
    const impacts = buildImpacts({
      impactsMetrics: [
        { name: "avoidedTrafficCo2EqEmissions", total: 60, detailsByYear: [10, 20, 30] },
        { name: "decontaminatedSurface", total: 500 },
      ],
      breakdown: {
        projectIndirectImpactMetrics: [
          { name: "soilsDistribution", soilType: "BUILDINGS", total: 1000 },
          { name: "newPermeableGreenSurface", total: 500 },
        ],
      },
    });

    const cropped = cropImpactsByEvaluationPeriod(impacts, 2);

    assert.deepStrictEqual(
      {
        impactsMetrics: cropped.aggregatedReconversionImpacts.impactsMetrics,
        projectIndirectImpactMetrics:
          cropped.reconversionImpactsBreakdown.projectIndirectImpactMetrics,
      },
      {
        impactsMetrics: [
          { name: "avoidedTrafficCo2EqEmissions", total: 30, detailsByYear: [10, 20] },
          { name: "decontaminatedSurface", total: 500 },
        ],
        projectIndirectImpactMetrics: [
          { name: "soilsDistribution", soilType: "BUILDINGS", total: 1000 },
          { name: "newPermeableGreenSurface", total: 500 },
        ],
      },
    );
  });

  it("re-sums the breakdown's project-indirect metrics and on-site/statu-quo economic data", () => {
    const impacts = buildImpacts({
      breakdown: {
        projectIndirectImpactMetrics: [
          { name: "avoidedVehiculeKilometers", total: 900, detailsByYear: [300, 300, 300] },
        ],
        projectOnSiteIndirectEconomicImpactsData: {
          total: 600,
          details: [
            {
              name: "waterRegulation",
              total: 600,
              detailsByYear: [200, 200, 200],
              cumulativeByYear: [200, 400, 600],
            },
          ],
        },
        siteStatuQuoIndirectEconomicImpactsData: {
          total: 90,
          details: [
            {
              name: "fricheMaintenanceAndSecuringCostsForOwner",
              details: "security",
              total: 90,
              detailsByYear: [30, 30, 30],
              cumulativeByYear: [30, 60, 90],
            },
          ],
        },
        siteStatuQuoImpactMetrics: [{ name: "permeableGreenSurface", total: 500 }],
      },
    });

    const cropped = cropImpactsByEvaluationPeriod(impacts, 2);

    assert.deepStrictEqual(cropped.reconversionImpactsBreakdown, {
      projectIndirectImpactMetrics: [
        { name: "avoidedVehiculeKilometers", total: 600, detailsByYear: [300, 300] },
      ],
      projectOnSiteIndirectEconomicImpactsData: {
        total: 400,
        details: [
          {
            name: "waterRegulation",
            total: 400,
            detailsByYear: [200, 200],
            cumulativeByYear: [200, 400],
          },
        ],
      },
      siteStatuQuoIndirectEconomicImpactsData: {
        total: 60,
        details: [
          {
            name: "fricheMaintenanceAndSecuringCostsForOwner",
            details: "security",
            total: 60,
            detailsByYear: [30, 30],
            cumulativeByYear: [30, 60],
          },
        ],
      },
      siteStatuQuoImpactMetrics: [{ name: "permeableGreenSurface", total: 500 }],
    });
  });

  it("keeps the break-even year untouched", () => {
    const impacts = buildImpacts({
      projectionYears: ["2026", "2027", "2028"],
      breakEvenYear: "2028",
    });

    const cropped = cropImpactsByEvaluationPeriod(impacts, 2);

    assert.strictEqual(cropped.aggregatedReconversionImpacts.breakEvenYear, "2028");
  });
});

describe("cropUrbanSprawlSimulationByEvaluationPeriod", () => {
  it("crops the urban sprawl comparison's years, balance and impacts data", () => {
    const simulation: UrbanSprawlImpactsComparisonResultDto = {
      simulationSiteData: {
        id: "3f1e2b1c-5d4a-4c7e-9a8b-1c2d3e4f5a6b",
        name: "Terrain agricole de Blajan",
        nature: "AGRICULTURAL_OPERATION",
        isExpressSite: true,
        address: {
          value: "Blajan",
          city: "Blajan",
          cityCode: "31070",
          postCode: "31350",
          long: 0.652416,
          lat: 43.260128,
        },
        ownerStructureType: "company",
        ownerName: "Exploitant agricole",
        surfaceArea: 10000,
        soilsDistribution: { PRAIRIE_GRASS: 10000 },
        yearlyExpenses: [],
        yearlyIncomes: [],
      },
      projectionYears: ["2026", "2027", "2028"],
      stakeholders,
      operationsFirstYear: 2026,
      simulationSiteStatuQuoImpactsData: {
        total: 150,
        details: [
          {
            name: "waterRegulation",
            total: 150,
            detailsByYear: [50, 50, 50],
            cumulativeByYear: [50, 100, 150],
          },
        ],
      },
      projectEconomicBalance: {
        total: -910,
        details: [
          {
            name: "projectOperatingExpenses",
            details: "maintenance",
            total: -60,
            detailsByYear: [-20, -20, -20],
            cumulativeByYear: [-20, -40, -60],
          },
          { name: "sitePurchase", total: -850 },
        ],
      },
      projectOnSimulationSiteImpactsData: {
        total: -300,
        details: [
          {
            name: "avoidedRoadsAndUtilitiesMaintenanceExpenses",
            total: -300,
            detailsByYear: [-100, -100, -100],
            cumulativeByYear: [-100, -200, -300],
          },
        ],
      },
      breakEvenYear: "2028",
      cumulativeBalanceByYear: [-900, -800, -700],
    };

    const cropped = cropUrbanSprawlSimulationByEvaluationPeriod(simulation, 2);

    assert.deepStrictEqual(cropped, {
      simulationSiteData: simulation.simulationSiteData,
      projectionYears: ["2026", "2027"],
      stakeholders,
      operationsFirstYear: 2026,
      simulationSiteStatuQuoImpactsData: {
        total: 100,
        details: [
          {
            name: "waterRegulation",
            total: 100,
            detailsByYear: [50, 50],
            cumulativeByYear: [50, 100],
          },
        ],
      },
      projectEconomicBalance: {
        total: -890,
        details: [
          {
            name: "projectOperatingExpenses",
            details: "maintenance",
            total: -40,
            detailsByYear: [-20, -20],
            cumulativeByYear: [-20, -40],
          },
          { name: "sitePurchase", total: -850 },
        ],
      },
      projectOnSimulationSiteImpactsData: {
        total: -200,
        details: [
          {
            name: "avoidedRoadsAndUtilitiesMaintenanceExpenses",
            total: -200,
            detailsByYear: [-100, -100],
            cumulativeByYear: [-100, -200],
          },
        ],
      },
      breakEvenYear: "2028",
      cumulativeBalanceByYear: [-900, -800],
    });
  });
});
