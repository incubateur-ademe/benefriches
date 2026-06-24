import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { InMemoryReconversionProjectsListQuery } from "src/reconversion-projects/adapters/secondary/queries/reconversion-project-list/InMemoryReconversionProjectsListQuery";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";

import type { ReconversionProjectsGroupedBySite } from "./getUserReconversionProjectsBySite.usecase";
import { GetUserReconversionProjectsBySiteUseCase } from "./getUserReconversionProjectsBySite.usecase";

describe("GetUserReconversionProjectsBySite Use Case", () => {
  it("Fails when userId is not provided", async () => {
    const usecase = new GetUserReconversionProjectsBySiteUseCase(
      new InMemoryReconversionProjectsListQuery(),
    );

    // @ts-expect-error userId is required
    const result = await usecase.execute({ userId: undefined });
    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult<"UserIdRequired">).getError(), "UserIdRequired");
  });

  it("gets list of reconversion projects grouped by site for a user", async () => {
    const reconversionProjects: ReconversionProjectsGroupedBySite = [
      {
        siteId: "a8fd7736-5836-4172-9811-ca71555dbbcc",
        siteName: "Site 1",
        siteNature: "NATURAL_AREA",
        isExpressSite: false,
        reconversionProjects: [],
      },
      {
        siteId: "7915a3dc-6928-46c8-81f0-41c5c6dde8f3",
        siteName: "Site 2",
        siteNature: "FRICHE",
        isExpressSite: false,
        fricheActivity: "INDUSTRY",
        reconversionProjects: [
          {
            id: "78330779-017d-49b3-bb3e-8b5724aaf56f",
            name: "ReconversionProject 1",
            type: "URBAN_PROJECT",
            isExpressProject: true,
          },
          {
            id: "b0f734d3-27f0-4876-a73a-637be27d12d2",
            name: "ReconversionProject 2",
            type: "PHOTOVOLTAIC_POWER_PLANT",
            isExpressProject: false,
          },
        ],
      },
    ];
    const userId = "0918223a-4d05-43a3-ad15-ccac704f7998";
    const query = new InMemoryReconversionProjectsListQuery(reconversionProjects);
    const spy = mock.method(query, "getGroupedBySite");

    const usecase = new GetUserReconversionProjectsBySiteUseCase(query);
    const result = await usecase.execute({ userId });
    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual(
      (result as SuccessResult<ReconversionProjectsGroupedBySite>).getData(),
      reconversionProjects,
    );
    assert.deepStrictEqual(spy.mock.calls[0]?.arguments, [{ userId }]);
  });
});
