import {
  photovoltaicProjectImpactMockMeta,
  photovoltaicProjectImpactsResultDto,
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
const urbanImpactsWithLocalAuthorityTenant = {
  ...urbanProjectImpactsResultDto,
  stakeholders: {
    ...urbanProjectImpactsResultDto.stakeholders,
    current: {
      ...urbanProjectImpactsResultDto.stakeholders.current,
      tenant: { structureType: "epci" as const, structureName: "CC Blajan" },
    },
  },
  aggregatedReconversionImpacts: {
    ...urbanProjectImpactsResultDto.aggregatedReconversionImpacts,
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
        currentViewMode: "summary",
        impacts: photovoltaicProjectImpactsResultDto,
        contextData: photovoltaicProjectImpactMockMeta,
      },
      appSettings: DEFAULT_APP_SETTINGS,
    });

    const viewData = selectProjectSummaryDataView(store.getState());

    expect(viewData).toEqual({
      breakEvenYear: undefined,
      projectionYears: buildProjectionYears(2024, 20),
      zanCompliance: {
        name: "zanCompliance",
        isSuccess: true,
        value: {
          isAgriculturalFriche: false,
          permeableSurfaceAreaDifference: -10000,
          artificializedSurfaceArea: 10000,
        },
      },
      mainImpactIndicator: {
        name: "avoidedFricheCostsForLocalAuthority",
        isSuccess: false,
        value: {
          details: [
            {
              impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
              amount: 0,
              bearerName: "Mairie de Blajan",
            },
          ],
          total: 0,
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
        currentViewMode: "summary",
        impacts: urbanImpactsWithLocalAuthorityTenant,
        contextData: urbanProjectImpactMockMeta,
      },
      appSettings: DEFAULT_APP_SETTINGS,
    });

    const viewData = selectProjectSummaryDataView(store.getState());

    expect(viewData).toEqual({
      breakEvenYear: "2040",
      projectionYears: buildProjectionYears(2026, 50),
      zanCompliance: {
        name: "zanCompliance",
        isSuccess: true,
        value: {
          isAgriculturalFriche: false,
          permeableSurfaceAreaDifference: 50000,
          artificializedSurfaceArea: 0,
        },
      },
      mainImpactIndicator: {
        name: "avoidedFricheCostsForLocalAuthority",
        isSuccess: true,
        value: {
          details: [
            {
              impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
              amount: 0,
              bearerName: "Mairie de Blajan",
            },
            {
              impactName: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
              amount: 131000,
              bearerName: "CC Blajan",
            },
          ],
          total: 131000,
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
        currentViewMode: "summary",
        impacts: urbanImpactsWithLocalAuthorityTenant,
        contextData: urbanProjectImpactMockMeta,
      },
      appSettings: DEFAULT_APP_SETTINGS,
    });

    const viewData = selectProjectSummaryDataView(store.getState());

    expect(viewData).toEqual({
      breakEvenYear: "2040",
      projectionYears: buildProjectionYears(2026, 10),
      zanCompliance: {
        name: "zanCompliance",
        isSuccess: true,
        value: {
          isAgriculturalFriche: false,
          permeableSurfaceAreaDifference: 50000,
          artificializedSurfaceArea: 0,
        },
      },
      mainImpactIndicator: {
        name: "avoidedFricheCostsForLocalAuthority",
        isSuccess: true,
        value: {
          details: [
            {
              impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
              amount: 0,
              bearerName: "Mairie de Blajan",
            },
            {
              impactName: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
              amount: 26200,
              bearerName: "CC Blajan",
            },
          ],
          total: 26200,
        },
      },
      siteId: "13958ec7-0468-4ecb-8217-0cc80a82b633",
      siteName: "Friche agricole de Blajan",
      siteAddress: { label: "Blajan", lat: 2.45, long: 45.26 },
      projectContext: { isDemo: false, isUrban: true },
    });
  });
});
