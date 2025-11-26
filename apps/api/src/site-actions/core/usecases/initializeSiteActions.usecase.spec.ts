/* oxlint-disable typescript-eslint/no-confusing-void-expression, typescript-eslint/no-unsafe-assignment */
import { describe, expect, it } from "vitest";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";

import { InMemorySiteActionsQuery } from "../../adapters/secondary/site-actions-query/InMemorySiteActionsQuery";
import { InMemorySiteActionsRepository } from "../../adapters/secondary/site-actions-repository/InMemorySiteActionsRepository";
import { InitializeSiteActionsUseCase } from "./initializeSiteActions.usecase";

describe("InitializeSiteActions UseCase", () => {
  it("should create 6 site actions with status 'todo'", async () => {
    const repository = new InMemorySiteActionsRepository();
    const query = new InMemorySiteActionsQuery();
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-01T10:00:00.000Z"));
    const uuidGenerator = new DeterministicUuidGenerator();
    uuidGenerator.nextUuids("action-1", "action-2", "action-3", "action-4", "action-5", "action-6");

    const usecase = new InitializeSiteActionsUseCase(
      repository,
      query,
      dateProvider,
      uuidGenerator,
    );

    const result = await usecase.execute({
      siteId: "site-123",
    });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult).getData()).toBeUndefined();

    const savedActions = repository._getSiteActions();
    expect(savedActions).toHaveLength(6);

    const actionsByType = new Map(savedActions.map((a) => [a.actionType, a]));

    expect(actionsByType.get("EVALUATE_COMPATIBILITY")).toEqual({
      id: expect.any(String),
      siteId: "site-123",
      actionType: "EVALUATE_COMPATIBILITY",
      status: "todo",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    });

    expect(actionsByType.get("EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS")).toEqual({
      id: expect.any(String),
      siteId: "site-123",
      actionType: "EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS",
      status: "todo",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    });

    expect(actionsByType.get("REQUEST_URBAN_VITALIZ_SUPPORT")).toEqual({
      id: expect.any(String),
      siteId: "site-123",
      actionType: "REQUEST_URBAN_VITALIZ_SUPPORT",
      status: "todo",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    });

    expect(actionsByType.get("REQUEST_INFORMATION_ABOUT_REMEDIATION")).toEqual({
      id: expect.any(String),
      siteId: "site-123",
      actionType: "REQUEST_INFORMATION_ABOUT_REMEDIATION",
      status: "todo",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    });

    expect(actionsByType.get("REQUEST_FUNDING_INFORMATION")).toEqual({
      id: expect.any(String),
      siteId: "site-123",
      actionType: "REQUEST_FUNDING_INFORMATION",
      status: "todo",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    });

    expect(actionsByType.get("REFERENCE_SITE_ON_CARTOFRICHES")).toEqual({
      id: expect.any(String),
      siteId: "site-123",
      actionType: "REFERENCE_SITE_ON_CARTOFRICHES",
      status: "todo",
      createdAt: new Date("2024-01-01T10:00:00.000Z"),
    });
  });

  it("should fail when site actions already exist", async () => {
    const repository = new InMemorySiteActionsRepository();
    const query = new InMemorySiteActionsQuery([
      {
        id: "existing-1",
        siteId: "site-123",
        actionType: "EVALUATE_COMPATIBILITY",
        status: "todo",
        createdAt: new Date("2024-01-01T09:00:00.000Z"),
      },
    ]);
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-01T10:00:00.000Z"));
    const uuidGenerator = new DeterministicUuidGenerator();

    const usecase = new InitializeSiteActionsUseCase(
      repository,
      query,
      dateProvider,
      uuidGenerator,
    );

    const result = await usecase.execute({
      siteId: "site-123",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"SiteAlreadyInitialized">).getError()).toBe(
      "SiteAlreadyInitialized",
    );

    // Verify no actions were saved
    expect(repository._getSiteActions()).toHaveLength(0);
  });
});
