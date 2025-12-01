import { vi } from "vitest";

import { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemoryMutabilityEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/InMemoryMutabilityEvaluationQuery";
import { InMemorySiteEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/InMemorySiteEvaluationQuery";

import { SiteEvaluationDataView } from "../gateways/SiteEvaluationQuery";
import {
  GetUserSiteEvaluationsUseCase,
  UserSiteEvaluation,
} from "./getUserSiteEvaluations.usecase";

describe("GetUserSiteEvaluationsUseCase", () => {
  it("Fails when userId is not provided", async () => {
    const usecase = new GetUserSiteEvaluationsUseCase(
      new InMemorySiteEvaluationQuery(),
      new InMemoryMutabilityEvaluationQuery(),
    );

    // @ts-expect-error userId is required
    const result = await usecase.execute({ userId: undefined });
    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"UserIdRequired">).getError()).toBe("UserIdRequired");
  });

  it("gets list of user sites with last projects and compatibility evaluation", async () => {
    const siteEvaluations: SiteEvaluationDataView[] = [
      {
        siteId: "a8fd7736-5836-4172-9811-ca71555dbbcc",
        siteName: "Site 1",
        siteNature: "NATURAL_AREA",
        isExpressSite: false,
        reconversionProjects: { total: 0, lastProjects: [] },
      },
      {
        siteId: "7915a3dc-6928-46c8-81f0-41c5c6dde8f3",
        siteName: "Site 2",
        siteNature: "FRICHE",
        isExpressSite: false,
        compatibilityEvaluation: {
          mutafrichesEvaluationId: "24ffc957-6a91-4309-b176-3699d70f1bf3",
          id: "9fb6701a-0d19-4ad6-ac2c-0f83bd1e5c7e",
        },
        reconversionProjects: {
          total: 2,
          lastProjects: [
            {
              id: "78330779-017d-49b3-bb3e-8b5724aaf56f",
              name: "ReconversionProject 1",
              projectType: "URBAN_PROJECT",
              isExpressProject: true,
            },
            {
              id: "b0f734d3-27f0-4876-a73a-637be27d12d2",
              name: "ReconversionProject 2",
              projectType: "PHOTOVOLTAIC_POWER_PLANT",
              isExpressProject: false,
            },
          ],
        },
      },
    ];
    const userId = "0918223a-4d05-43a3-ad15-ccac704f7998";
    const evalutionQuery = new InMemorySiteEvaluationQuery(siteEvaluations);
    const mutabilityQuery = new InMemoryMutabilityEvaluationQuery();
    mutabilityQuery.withDefaultDataForId("24ffc957-6a91-4309-b176-3699d70f1bf3");

    vi.spyOn(evalutionQuery, "getUserSiteEvaluations");
    vi.spyOn(mutabilityQuery, "getEvaluation");

    const usecase = new GetUserSiteEvaluationsUseCase(evalutionQuery, mutabilityQuery);
    const result = await usecase.execute({ userId });
    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult<UserSiteEvaluation[]>).getData()).toEqual([
      siteEvaluations[0],
      {
        ...siteEvaluations[1],
        compatibilityEvaluation: {
          ...siteEvaluations[1]?.compatibilityEvaluation,
          top3Usages: [
            {
              usage: "equipements",
              score: 0.7,
              rank: 1,
            },
            {
              usage: "culture",
              score: 0.65,
              rank: 2,
            },
            {
              usage: "residentiel",
              score: 0.5,
              rank: 3,
            },
          ],
        },
      },
    ]);
    /* oxlint-disable-next-line typescript/unbound-method */
    expect(evalutionQuery.getUserSiteEvaluations).toHaveBeenCalledWith(userId);
    /* oxlint-disable-next-line typescript/unbound-method */
    expect(mutabilityQuery.getEvaluation).toHaveBeenCalledExactlyOnceWith(
      "24ffc957-6a91-4309-b176-3699d70f1bf3",
    );
  });
});
