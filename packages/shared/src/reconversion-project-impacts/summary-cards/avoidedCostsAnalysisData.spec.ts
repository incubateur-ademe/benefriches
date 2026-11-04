import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { urbanProjectImpactsResultDto } from "../mocks";
import { getAvoidedCostsAnalysisData } from "./avoidedCostsAnalysisData";

const buildImpact = (total: number) => ({
  total: total,
  detailsByYear: [],
  cumulativeByYear: [],
});

describe("getAvoidedCostsAnalysisData", () => {
  it("returns municipalityExpenses amount for local authority as main impact", () => {
    const data = getAvoidedCostsAnalysisData({
      ...urbanProjectImpactsResultDto,
      aggregatedReconversionImpacts: {
        ...urbanProjectImpactsResultDto.aggregatedReconversionImpacts,
        indirectEconomicImpacts: {
          total: 15_000,
          details: [
            {
              name: "avoidedCarRelatedExpenses",
              ...buildImpact(50_000),
            },
            {
              name: "newStoredCo2Eq",
              ...buildImpact(-55_000),
            },
            {
              name: "waterRegulation",
              ...buildImpact(40_000),
            },
            {
              name: "fricheRoadsAndUtilitiesExpenses",
              ...buildImpact(-20_000),
            },
          ],
        },
      },
    });

    assert.deepStrictEqual(data, {
      localAuthorityMainIndirectEconomicImpact: {
        name: "municipalityExpenses",
        total: 20_000,
      },
      indirectEconomicImpactsTotal: 15_000,
    });
  });

  it("returns municipalityExpenses negative amount for local authority as main impact", () => {
    const data = getAvoidedCostsAnalysisData({
      ...urbanProjectImpactsResultDto,
      aggregatedReconversionImpacts: {
        ...urbanProjectImpactsResultDto.aggregatedReconversionImpacts,
        indirectEconomicImpacts: {
          total: 15_000,
          details: [
            {
              name: "avoidedCarRelatedExpenses",
              ...buildImpact(50_000),
            },
            {
              name: "newStoredCo2Eq",
              ...buildImpact(-55_000),
            },
            {
              name: "projectNewHousesTaxesIncome",
              ...buildImpact(40_000),
            },
            {
              name: "fricheRoadsAndUtilitiesExpenses",
              ...buildImpact(-50_000),
            },
          ],
        },
      },
    });

    assert.deepStrictEqual(data, {
      localAuthorityMainIndirectEconomicImpact: {
        name: "municipalityExpenses",
        total: -50_000,
      },
      indirectEconomicImpactsTotal: 15_000,
    });
  });

  it("returns no main impact for localAuthority", () => {
    const data = getAvoidedCostsAnalysisData({
      ...urbanProjectImpactsResultDto,
      aggregatedReconversionImpacts: {
        ...urbanProjectImpactsResultDto.aggregatedReconversionImpacts,
        indirectEconomicImpacts: {
          total: -5_000,
          details: [
            {
              name: "avoidedCarRelatedExpenses",
              ...buildImpact(50_000),
            },
            {
              name: "newStoredCo2Eq",
              ...buildImpact(-55_000),
            },
          ],
        },
      },
    });

    assert.deepStrictEqual(data, {
      localAuthorityMainIndirectEconomicImpact: undefined,
      indirectEconomicImpactsTotal: -5_000,
    });
  });

  it("returns fricheCosts negative amount for local authority as main impact when municipality is owner", () => {
    const data = getAvoidedCostsAnalysisData({
      ...urbanProjectImpactsResultDto,

      aggregatedReconversionImpacts: {
        ...urbanProjectImpactsResultDto.aggregatedReconversionImpacts,
        indirectEconomicImpacts: {
          total: 15_000,
          details: [
            {
              name: "avoidedCarRelatedExpenses",
              ...buildImpact(50_000),
            },
            {
              name: "newStoredCo2Eq",
              ...buildImpact(-55_000),
            },
            {
              name: "projectNewHousesTaxesIncome",
              ...buildImpact(40_000),
            },
            {
              name: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
              details: "illegalDumpingCost",
              ...buildImpact(-50_000),
            },
          ],
        },
      },
    });

    assert.deepStrictEqual(data, {
      localAuthorityMainIndirectEconomicImpact: {
        name: "fricheCosts",
        total: -50_000,
      },
      indirectEconomicImpactsTotal: 15_000,
    });
  });

  it("does not returns fricheCosts amount for local authority as main impact when municipality is not owner of the expenses", () => {
    const data = getAvoidedCostsAnalysisData({
      ...urbanProjectImpactsResultDto,

      aggregatedReconversionImpacts: {
        ...urbanProjectImpactsResultDto.aggregatedReconversionImpacts,
        indirectEconomicImpacts: {
          total: 15_000,
          details: [
            {
              name: "avoidedCarRelatedExpenses",
              ...buildImpact(50_000),
            },
            {
              name: "newStoredCo2Eq",
              ...buildImpact(-55_000),
            },
            {
              name: "projectNewHousesTaxesIncome",
              ...buildImpact(40_000),
            },
            {
              name: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
              details: "illegalDumpingCost",
              ...buildImpact(-50_000),
            },
          ],
        },
      },
    });

    assert.deepStrictEqual(data, {
      localAuthorityMainIndirectEconomicImpact: {
        name: "taxesIncome",
        total: 40_000,
      },
      indirectEconomicImpactsTotal: 15_000,
    });
  });
});
