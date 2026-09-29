import type {
  GetReconversionProjectImpactsResultDto,
  UrbanSprawlImpactsComparisonResultDto,
} from "shared";
import {
  photovoltaicProjectDevelopmentScoreMock,
  photovoltaicProjectImpactMockMeta,
  photovoltaicProjectImpactsResultDto,
  urbanProjectImpactMockMeta,
} from "shared";

import { createStore } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { StoreBuilder } from ".";
import { reconversionProjectImpactsBreakEvenLevelRequested } from "../actions";
import { selectAvoidedUrbanSprawlCostsAnalysisDataView } from "../selectors/projectAvoidedCostsAnalysis.selectors";
import {
  selectImpactsCroppedByEvaluationPeriod,
  selectImpactsPageViewData,
} from "../selectors/projectImpacts.selectors";

// Characterization of the evaluation period (the default one and the crop), pinned on the code as
// it was before the crop and the default moved to the shared package.

// A 3-year impacts result with one item in each list the crop touches.
const threeYearImpacts: GetReconversionProjectImpactsResultDto["impacts"] = {
  projectionYears: ["2026", "2027", "2028"],
  operationsFirstYear: 2026,
  stakeholders: {
    current: { owner: { structureType: "municipality", structureName: "Mairie de Blajan" } },
    future: {},
    project: {
      developer: { structureType: "company", structureName: "Aménageur" },
      reinstatementContractOwner: { structureType: "unknown" },
    },
  },
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
  aggregatedReconversionImpacts: {
    breakEvenYear: "2028",
    cumulativeBalanceByYear: [-100, 50, 200],
    cumulativeEconomicBalanceByYear: [-300, -300, -300],
    cumulativeIndirectEconomicImpactsByYear: [200, 350, 500],
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
    impactsMetrics: [
      { name: "conversionFullTimeJobs", total: 30 },
      { name: "avoidedTrafficCo2EqEmissions", total: 60, detailsByYear: [10, 20, 30] },
      { name: "decontaminatedSurface", total: 500 },
    ],
  },
  reconversionImpactsBreakdown: {
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
    projectIndirectImpactMetrics: [
      { name: "soilsDistribution", soilType: "BUILDINGS", total: 1000 },
      { name: "avoidedVehiculeKilometers", total: 900, detailsByYear: [300, 300, 300] },
    ],
    siteStatuQuoImpactMetrics: [{ name: "permeableGreenSurface", total: 500 }],
  },
};

describe("Project impacts evaluation period", () => {
  it("opens a photovoltaic project's impacts on a 30-year period", async () => {
    const projectImpactsServiceMock = new MockReconversionProjectImpactsApi();
    projectImpactsServiceMock._setReconversionProjectImpacts({
      impacts: photovoltaicProjectImpactsResultDto,
      contextData: photovoltaicProjectImpactMockMeta,
      developmentScore: photovoltaicProjectDevelopmentScoreMock,
    });
    const store = new StoreBuilder()
      .withAppDependencies({ reconversionProjectImpacts: projectImpactsServiceMock })
      .build();

    await store.dispatch(reconversionProjectImpactsBreakEvenLevelRequested({ projectId: "12345" }));

    expect(selectImpactsPageViewData(store.getState()).evaluationPeriod).toEqual(30);
  });

  it("keeps a period chosen before the impacts load", async () => {
    const projectImpactsServiceMock = new MockReconversionProjectImpactsApi();
    projectImpactsServiceMock._setReconversionProjectImpacts({
      impacts: photovoltaicProjectImpactsResultDto,
      contextData: photovoltaicProjectImpactMockMeta,
      developmentScore: photovoltaicProjectDevelopmentScoreMock,
    });
    const store = new StoreBuilder()
      .withAppDependencies({ reconversionProjectImpacts: projectImpactsServiceMock })
      .withEvaluationPeriod(20)
      .build();

    await store.dispatch(reconversionProjectImpactsBreakEvenLevelRequested({ projectId: "12345" }));

    expect(selectImpactsPageViewData(store.getState()).evaluationPeriod).toEqual(20);
  });

  it("crops the impacts to the evaluation period", () => {
    const store = createStore(getTestAppDependencies(), {
      projectImpacts: {
        dataLoadingState: { impacts: "success", urbanSprawlSimulation: "idle" },
        evaluationPeriod: 2,
        currentViewMode: "summary",
        impacts: threeYearImpacts,
        contextData: urbanProjectImpactMockMeta,
      },
      appSettings: DEFAULT_APP_SETTINGS,
    });

    const croppedImpacts = selectImpactsCroppedByEvaluationPeriod(store.getState());

    expect(croppedImpacts).toEqual({
      projectionYears: ["2026", "2027"],
      operationsFirstYear: 2026,
      stakeholders: threeYearImpacts.stakeholders,
      projectEconomicBalance: {
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
      },
      aggregatedReconversionImpacts: {
        breakEvenYear: "2028",
        cumulativeBalanceByYear: [-100, 50],
        cumulativeEconomicBalanceByYear: [-300, -300],
        cumulativeIndirectEconomicImpactsByYear: [200, 350],
        indirectEconomicImpacts: {
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
        },
        impactsMetrics: [
          { name: "conversionFullTimeJobs", total: 45 },
          { name: "avoidedTrafficCo2EqEmissions", total: 30, detailsByYear: [10, 20] },
          { name: "decontaminatedSurface", total: 500 },
        ],
      },
      reconversionImpactsBreakdown: {
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
        projectIndirectImpactMetrics: [
          { name: "soilsDistribution", soilType: "BUILDINGS", total: 1000 },
          { name: "avoidedVehiculeKilometers", total: 600, detailsByYear: [300, 300] },
        ],
        siteStatuQuoImpactMetrics: [{ name: "permeableGreenSurface", total: 500 }],
      },
    });
  });

  it("crops the urban sprawl comparison to the evaluation period", () => {
    const urbanSprawlSimulation: UrbanSprawlImpactsComparisonResultDto = {
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
      stakeholders: threeYearImpacts.stakeholders,
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
    const store = createStore(getTestAppDependencies(), {
      projectImpacts: {
        dataLoadingState: { impacts: "success", urbanSprawlSimulation: "success" },
        evaluationPeriod: 2,
        currentViewMode: "summary",
        impacts: threeYearImpacts,
        contextData: urbanProjectImpactMockMeta,
        urbanSprawlSimulation,
      },
      appSettings: DEFAULT_APP_SETTINGS,
    });

    const viewData = selectAvoidedUrbanSprawlCostsAnalysisDataView(store.getState());

    expect(viewData.urbanSprawlSimulation).toEqual({
      simulationSiteData: urbanSprawlSimulation.simulationSiteData,
      projectionYears: ["2026", "2027"],
      stakeholders: threeYearImpacts.stakeholders,
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
      simulationSiteStatuQuoImpactsByBearerAndCategory: {
        total: 100,
        humanity: { total: 0 },
        localPeopleOrCompany: { total: 0 },
        localAuthority: {
          total: 100,
          municipalityExpenses: [
            {
              name: "waterRegulation",
              total: 100,
              detailsByYear: [50, 50],
              cumulativeByYear: [50, 100],
            },
          ],
        },
      },
      projectOnSimulationSiteImpactsByBearerAndCategory: {
        total: -200,
        humanity: { total: 0 },
        localPeopleOrCompany: { total: 0 },
        localAuthority: {
          total: -200,
          municipalityExpenses: [
            {
              name: "avoidedRoadsAndUtilitiesMaintenanceExpenses",
              total: -200,
              detailsByYear: [-100, -100],
              cumulativeByYear: [-100, -200],
            },
          ],
        },
      },
    });
  });
});
