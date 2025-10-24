import { vi } from "vitest";

import { InMemoryReconversionProjectsListQuery } from "src/reconversion-projects/adapters/secondary/queries/reconversion-project-list/InMemoryReconversionProjectsListQuery";
import { FailureResult, SuccessResult } from "src/shared-kernel/result";

import {
  GetUserReconversionProjectsBySiteUseCase,
  ReconversionProjectsGroupedBySite,
} from "./getUserReconversionProjectsBySite.usecase";

describe("GetUserReconversionProjectsBySite Use Case", () => {
  it("Fails when userId is not provided", async () => {
    const usecase = new GetUserReconversionProjectsBySiteUseCase(
      new InMemoryReconversionProjectsListQuery(),
    );

    // @ts-expect-error userId is required
    const result = await usecase.execute({ userId: undefined });
    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"UserIdRequired">).getError()).toBe("UserIdRequired");
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
    vi.spyOn(query, "getGroupedBySite");

    const usecase = new GetUserReconversionProjectsBySiteUseCase(query);
    const result = await usecase.execute({ userId });
    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult<ReconversionProjectsGroupedBySite>).getData()).toEqual(
      reconversionProjects,
    );
    /* oxlint-disable-next-line typescript/unbound-method */
    expect(query.getGroupedBySite).toHaveBeenCalledWith({ userId });
  });
});
