import { describe, expect, it } from "vitest";

import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";

import { StoreBuilder } from ".";
import { impactsExported } from "../actions/impactsExported.action";

const sections = {
  siteFeatures: true,
  projectFeatures: true,
  economicBalance: false,
  socioEconomicImpacts: true,
  socialImpacts: false,
  environmentalImpacts: true,
  aboutBenefriches: false,
};

describe("impactsExported", () => {
  it("reports the impacts export with the project, format and selected sections", async () => {
    const reconversionProjectImpacts = new MockReconversionProjectImpactsApi();
    const store = new StoreBuilder().withAppDependencies({ reconversionProjectImpacts }).build();

    await store.dispatch(impactsExported({ projectId: "project-id", format: "pdf", sections }));

    expect(reconversionProjectImpacts.reportedImpactsExports).toEqual([
      { reconversionProjectId: "project-id", impactsExport: { format: "pdf", sections } },
    ]);
  });

  it("fulfills without error when reporting the impacts export fails", async () => {
    const reconversionProjectImpacts = new MockReconversionProjectImpactsApi();
    reconversionProjectImpacts._setReportingImpactsExportFails();
    const store = new StoreBuilder().withAppDependencies({ reconversionProjectImpacts }).build();

    const action = await store.dispatch(
      impactsExported({ projectId: "project-id", format: "pdf", sections }),
    );

    expect(action.meta.requestStatus).toEqual("fulfilled");
  });
});
