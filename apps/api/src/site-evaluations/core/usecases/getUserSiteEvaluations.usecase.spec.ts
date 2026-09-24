import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { SilentLogger } from "src/shared-kernel/adapters/logger/SilentLogger";
import { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemoryMutabilityEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/InMemoryMutabilityEvaluationQuery";
import { InMemorySiteEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/InMemorySiteEvaluationQuery";

import { SiteEvaluationDataView } from "../gateways/SiteEvaluationQuery";
import {
  GetUserSiteEvaluationsUseCase,
  UserSiteEvaluation,
} from "./getUserSiteEvaluations.usecase";

describe("GetUserSiteEvaluationsUseCase", () => {
  const userId = "0918223a-4d05-43a3-ad15-ccac704f7998";

  it("Fails when userId is not provided", async () => {
    const usecase = new GetUserSiteEvaluationsUseCase(
      new InMemorySiteEvaluationQuery(),
      new InMemoryMutabilityEvaluationQuery(),
      new SilentLogger(),
    );

    // @ts-expect-error userId is required
    const result = await usecase.execute({ userId: undefined });
    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult<"UserIdRequired">).getError(), "UserIdRequired");
  });

  it("gets list of user sites with last projects and compatibility evaluation", async () => {
    const siteEvaluations: SiteEvaluationDataView[] = [
      {
        siteId: "a8fd7736-5836-4172-9811-ca71555dbbcc",
        siteName: "Site 1",
        siteNature: "NATURAL_AREA",
        isExpressSite: false,
        siteCreatedBy: userId,
        siteCreationMode: "custom",
        reconversionProjects: { total: 0, lastProjects: [] },
      },
      {
        siteId: "7915a3dc-6928-46c8-81f0-41c5c6dde8f3",
        siteName: "Site 2",
        siteNature: "FRICHE",
        isExpressSite: false,
        siteCreatedBy: userId,
        siteCreationMode: "custom",
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
    const evalutionQuery = new InMemorySiteEvaluationQuery(siteEvaluations);
    const mutabilityQuery = new InMemoryMutabilityEvaluationQuery();
    mutabilityQuery.withDefaultDataForId("24ffc957-6a91-4309-b176-3699d70f1bf3");

    const evaluationSpy = mock.method(evalutionQuery, "getUserSiteEvaluations");
    const mutabilitySpy = mock.method(mutabilityQuery, "getEvaluation");

    const usecase = new GetUserSiteEvaluationsUseCase(
      evalutionQuery,
      mutabilityQuery,
      new SilentLogger(),
    );
    const result = await usecase.execute({ userId });
    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<UserSiteEvaluation[]>).getData(), [
      {
        siteId: "a8fd7736-5836-4172-9811-ca71555dbbcc",
        siteName: "Site 1",
        siteNature: "NATURAL_AREA",
        isExpressSite: false,
        reconversionProjects: { total: 0, lastProjects: [] },
        isEditable: true,
        notEditableReason: null,
      },
      {
        siteId: "7915a3dc-6928-46c8-81f0-41c5c6dde8f3",
        siteName: "Site 2",
        siteNature: "FRICHE",
        isExpressSite: false,
        isEditable: false,
        notEditableReason: "ACTIVE_RECONVERSION_PROJECT",
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
        compatibilityEvaluation: {
          mutafrichesEvaluationId: "24ffc957-6a91-4309-b176-3699d70f1bf3",
          id: "9fb6701a-0d19-4ad6-ac2c-0f83bd1e5c7e",
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
    assert.deepStrictEqual(evaluationSpy.mock.calls[0]?.arguments, [userId]);
    assert.strictEqual(mutabilitySpy.mock.callCount(), 1);
    assert.deepStrictEqual(mutabilitySpy.mock.calls[0]?.arguments, [
      "24ffc957-6a91-4309-b176-3699d70f1bf3",
    ]);
  });

  it("marks a custom site with no active reconversion project as editable", async () => {
    const siteEvaluations: SiteEvaluationDataView[] = [
      {
        siteId: "a8fd7736-5836-4172-9811-ca71555dbbcc",
        siteName: "Editable site",
        siteNature: "NATURAL_AREA",
        isExpressSite: false,
        siteCreatedBy: userId,
        siteCreationMode: "custom",
        reconversionProjects: { total: 0, lastProjects: [] },
      },
    ];
    const usecase = new GetUserSiteEvaluationsUseCase(
      new InMemorySiteEvaluationQuery(siteEvaluations),
      new InMemoryMutabilityEvaluationQuery(),
      new SilentLogger(),
    );

    const result = await usecase.execute({ userId });

    assert.strictEqual(result.isSuccess(), true);
    const [row] = (result as SuccessResult<UserSiteEvaluation[]>).getData();
    assert.strictEqual(row?.isEditable, true);
    assert.strictEqual(row?.notEditableReason, null);
  });

  it("marks a site with active reconversion projects as not editable", async () => {
    const siteEvaluations: SiteEvaluationDataView[] = [
      {
        siteId: "a8fd7736-5836-4172-9811-ca71555dbbcc",
        siteName: "Site with active projects",
        siteNature: "NATURAL_AREA",
        isExpressSite: false,
        siteCreatedBy: userId,
        siteCreationMode: "custom",
        reconversionProjects: { total: 2, lastProjects: [] },
      },
    ];
    const usecase = new GetUserSiteEvaluationsUseCase(
      new InMemorySiteEvaluationQuery(siteEvaluations),
      new InMemoryMutabilityEvaluationQuery(),
      new SilentLogger(),
    );

    const result = await usecase.execute({ userId });

    assert.strictEqual(result.isSuccess(), true);
    const [row] = (result as SuccessResult<UserSiteEvaluation[]>).getData();
    assert.strictEqual(row?.isEditable, false);
    assert.strictEqual(row?.notEditableReason, "ACTIVE_RECONVERSION_PROJECT");
  });

  it("marks a csv-imported site as not editable even though it is not an express site", async () => {
    const siteEvaluations: SiteEvaluationDataView[] = [
      {
        siteId: "a8fd7736-5836-4172-9811-ca71555dbbcc",
        siteName: "Csv-imported site",
        siteNature: "NATURAL_AREA",
        isExpressSite: false,
        siteCreatedBy: userId,
        siteCreationMode: "csv-import",
        reconversionProjects: { total: 0, lastProjects: [] },
      },
    ];
    const usecase = new GetUserSiteEvaluationsUseCase(
      new InMemorySiteEvaluationQuery(siteEvaluations),
      new InMemoryMutabilityEvaluationQuery(),
      new SilentLogger(),
    );

    const result = await usecase.execute({ userId });

    assert.strictEqual(result.isSuccess(), true);
    const [row] = (result as SuccessResult<UserSiteEvaluation[]>).getData();
    assert.strictEqual(row?.isExpressSite, false);
    assert.strictEqual(row?.isEditable, false);
    assert.strictEqual(row?.notEditableReason, "NOT_CUSTOM");
  });
});
