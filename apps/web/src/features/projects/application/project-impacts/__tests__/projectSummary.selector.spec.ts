import {
  type GetReconversionProjectImpactsResultDto,
  photovoltaicProjectDevelopmentScoreMock,
  photovoltaicProjectImpactMockMeta,
  photovoltaicProjectImpactsResultDto,
  roundToInteger,
  urbanProjectDevelopmentScoreMock,
  urbanProjectImpactMockMeta,
  urbanProjectImpactsResultDto,
} from "shared";

import { createStore } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectProjectSummaryDataView } from "../selectors/projectSummary.selector";

// Characterization of the Synthèse ("Aperçu") headline data, pinned on the code as it was
// before the key impact indicators moved to the shared package.

// The urban mock with a local-authority tenant (so the avoided friche costs depend on the
// evaluation period) and a break-even year.

const buildYearlySeries = (total: number, years: number) => {
  const perYear = roundToInteger(total / years);
  const detailsByYear = Array.from({ length: years }, () => perYear);
  const roundedSum = roundToInteger(perYear * years);
  detailsByYear[years - 1] = roundToInteger((detailsByYear[years - 1] ?? 0) + (total - roundedSum));

  let cumulative = 0;
  const cumulativeByYear = detailsByYear.map((value) => {
    cumulative = roundToInteger(cumulative + value);
    return cumulative;
  });

  return { detailsByYear, cumulativeByYear };
};

const urbanImpactsWithLocalAuthorityTenant: GetReconversionProjectImpactsResultDto["impacts"] = {
  ...urbanProjectImpactsResultDto,
  stakeholders: {
    future: {},
    project: {
      developer: { structureType: "municipality", structureName: "Mairie de Blajan" },
      reinstatementContractOwner: { structureType: "unknown" },
    },
    current: {
      owner: { structureType: "municipality", structureName: "Mairie de Blajan" },
      tenant: { structureType: "epci" as const, structureName: "CC Blajan" },
    },
  },
  aggregatedReconversionImpacts: {
    ...urbanProjectImpactsResultDto.aggregatedReconversionImpacts,
    indirectEconomicImpacts: {
      total:
        urbanProjectImpactsResultDto.aggregatedReconversionImpacts.indirectEconomicImpacts.total +
        1000000,
      details: [
        ...urbanProjectImpactsResultDto.aggregatedReconversionImpacts.indirectEconomicImpacts
          .details,
        {
          name: "avoidedFricheMaintenanceAndSecuringCostsForTenant" as const,
          details: "illegalDumpingCost" as const,
          total: 1000000,
          ...buildYearlySeries(1000000, 50),
        },
      ],
    },
    breakEvenYear: "2040",
  },
};
const buildProjectionYears = (startYear: number, count: number) =>
  Array.from({ length: count }, (_, index) => String(startYear + index));

describe("selectProjectSummaryDataView", () => {
  it("returns the Synthèse data of a photovoltaic project on a friche", () => {
    const store = createStore(getTestAppDependencies(), {
      projectImpacts: {
        dataLoadingState: { impacts: "success", urbanSprawlSimulation: "idle" },
        evaluationPeriod: photovoltaicProjectImpactsResultDto.projectionYears.length,
        developmentScore: photovoltaicProjectDevelopmentScoreMock,
        impacts: photovoltaicProjectImpactsResultDto,
        contextData: photovoltaicProjectImpactMockMeta,
      },
      appSettings: DEFAULT_APP_SETTINGS,
    });

    const viewData = selectProjectSummaryDataView(store.getState());

    expect(viewData).toEqual({
      breakEvenYear: undefined,
      projectionYears: buildProjectionYears(2024, 20),
      developmentScore: photovoltaicProjectDevelopmentScoreMock,
      avoidedCostsAnalysisData: {
        indirectEconomicImpactsTotal: -195584,
        localAuthorityMainIndirectEconomicImpact: {
          name: "rentalIncome",
          total: -540000,
        },
      },
      siteId: "68382abb-3a81-45e6-8af4-913767a28141",
      siteName: "Friche agricole de Blajan",
      siteAddress: { label: "Blajan", lat: 2.45, long: 45.26 },
      projectContext: { isDemo: false, isUrban: false },
    });
  });

  it("returns the Synthèse data of an urban project on a friche", () => {
    const store = createStore(getTestAppDependencies(), {
      projectImpacts: {
        dataLoadingState: { impacts: "success", urbanSprawlSimulation: "idle" },
        evaluationPeriod: 50,
        impacts: urbanImpactsWithLocalAuthorityTenant,
        contextData: urbanProjectImpactMockMeta,
        developmentScore: urbanProjectDevelopmentScoreMock,
      },
      appSettings: DEFAULT_APP_SETTINGS,
    });

    const viewData = selectProjectSummaryDataView(store.getState());

    expect(viewData).toEqual({
      breakEvenYear: "2040",
      projectionYears: buildProjectionYears(2026, 50),
      developmentScore: urbanProjectDevelopmentScoreMock,
      avoidedCostsAnalysisData: {
        indirectEconomicImpactsTotal: 1324611,
        localAuthorityMainIndirectEconomicImpact: {
          name: "fricheCosts",
          total: 1131000,
        },
      },
      siteId: "13958ec7-0468-4ecb-8217-0cc80a82b633",
      siteName: "Friche agricole de Blajan",
      siteAddress: { label: "Blajan", lat: 2.45, long: 45.26 },
      projectContext: { isDemo: false, isUrban: true },
    });
  });

  it("judges the headlines on the cropped evaluation period", () => {
    const store = createStore(getTestAppDependencies(), {
      projectImpacts: {
        dataLoadingState: { impacts: "success", urbanSprawlSimulation: "idle" },
        evaluationPeriod: 10,
        impacts: urbanImpactsWithLocalAuthorityTenant,
        contextData: urbanProjectImpactMockMeta,
        developmentScore: urbanProjectDevelopmentScoreMock,
      },
      appSettings: DEFAULT_APP_SETTINGS,
    });

    const viewData = selectProjectSummaryDataView(store.getState());

    expect(viewData).toEqual({
      breakEvenYear: "2040",
      projectionYears: buildProjectionYears(2026, 10),
      developmentScore: urbanProjectDevelopmentScoreMock,
      avoidedCostsAnalysisData: {
        indirectEconomicImpactsTotal: 264930,
        localAuthorityMainIndirectEconomicImpact: {
          name: "fricheCosts",
          total: 226200,
        },
      },
      siteId: "13958ec7-0468-4ecb-8217-0cc80a82b633",
      siteName: "Friche agricole de Blajan",
      siteAddress: { label: "Blajan", lat: 2.45, long: 45.26 },
      projectContext: { isDemo: false, isUrban: true },
    });
  });
});
