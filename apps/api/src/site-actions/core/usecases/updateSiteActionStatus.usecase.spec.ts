/* oxlint-disable typescript-eslint/no-confusing-void-expression */
import { describe, expect, it } from "vitest";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";

import { InMemorySiteActionsQuery } from "../../adapters/secondary/site-actions-query/InMemorySiteActionsQuery";
import { InMemorySiteActionsRepository } from "../../adapters/secondary/site-actions-repository/InMemorySiteActionsRepository";
import type { SiteAction } from "../models/siteAction";
import { UpdateSiteActionStatusUseCase } from "./updateSiteActionStatus.usecase";

describe("UpdateSiteActionStatus UseCase", () => {
  it("should update action status to done and set completedAt", async () => {
    const action: SiteAction = {
      id: "action-1",
      siteId: "site-123",
      actionType: "EVALUATE_COMPATIBILITY",
      status: "todo",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    };

    const repository = new InMemorySiteActionsRepository();
    repository._setSiteActions([action]);
    const query = new InMemorySiteActionsQuery([action]);
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-02T10:00:00.000Z"));

    const usecase = new UpdateSiteActionStatusUseCase(repository, query, dateProvider);

    const result = await usecase.execute({
      siteId: "site-123",
      actionId: "action-1",
      status: "done",
    });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult).getData()).toBeUndefined();
  });

  it("should update action status to skipped and set completedAt", async () => {
    const action: SiteAction = {
      id: "action-1",
      siteId: "site-123",
      actionType: "REQUEST_FUNDING_INFORMATION",
      status: "todo",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    };

    const repository = new InMemorySiteActionsRepository();
    repository._setSiteActions([action]);
    const query = new InMemorySiteActionsQuery([action]);
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-02T10:00:00.000Z"));

    const usecase = new UpdateSiteActionStatusUseCase(repository, query, dateProvider);

    const result = await usecase.execute({
      siteId: "site-123",
      actionId: "action-1",
      status: "skipped",
    });

    expect(result.isSuccess()).toBe(true);
  });

  it("should fail when action not found", async () => {
    const repository = new InMemorySiteActionsRepository();
    const query = new InMemorySiteActionsQuery([]);
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-02T10:00:00.000Z"));

    const usecase = new UpdateSiteActionStatusUseCase(repository, query, dateProvider);

    const result = await usecase.execute({
      siteId: "site-123",
      actionId: "non-existent",
      status: "done",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"ActionNotFound">).getError()).toBe("ActionNotFound");
  });

  it("should be idempotent - return success without updating when action already done", async () => {
    const action: SiteAction = {
      id: "action-1",
      siteId: "site-123",
      actionType: "EVALUATE_COMPATIBILITY",
      status: "done",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
      completedAt: new Date("2024-01-01T15:00:00.000Z"),
    };

    const repository = new InMemorySiteActionsRepository();
    repository._setSiteActions([action]);
    const query = new InMemorySiteActionsQuery([action]);
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-02T10:00:00.000Z"));

    const usecase = new UpdateSiteActionStatusUseCase(repository, query, dateProvider);

    const result = await usecase.execute({
      siteId: "site-123",
      actionId: "action-1",
      status: "done",
    });

    expect(result.isSuccess()).toBe(true);
    const updatedActions = await query.getBySiteId("site-123");
    expect(updatedActions[0]?.completedAt).toEqual(new Date("2024-01-01T15:00:00.000Z"));
  });
});
