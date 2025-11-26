/* oxlint-disable typescript-eslint/no-confusing-void-expression, typescript-eslint/no-unsafe-assignment */
import type { GetSiteActionsResponseDto } from "shared";
import { describe, expect, it } from "vitest";

import type { SuccessResult } from "src/shared-kernel/result";

import { InMemorySiteActionsQuery } from "../../adapters/secondary/site-actions-query/InMemorySiteActionsQuery";
import type { SiteAction } from "../models/siteAction";
import { GetSiteActionsUseCase } from "./getSiteActions.usecase";

describe("GetSiteActions UseCase", () => {
  it("should return all site actions for a given site", async () => {
    const actions: SiteAction[] = [
      {
        id: "action-1",
        siteId: "site-123",
        actionType: "EVALUATE_COMPATIBILITY",
        status: "todo",
        createdAt: new Date("2024-01-01T10:00:00.000Z"),
      },
      {
        id: "action-2",
        siteId: "site-123",
        actionType: "REQUEST_FUNDING_INFORMATION",
        status: "done",
        createdAt: new Date("2024-01-01T10:00:00.000Z"),
        completedAt: new Date("2024-01-02T10:00:00.000Z"),
      },
    ];

    const query = new InMemorySiteActionsQuery(actions);
    const usecase = new GetSiteActionsUseCase(query);

    const result = await usecase.execute({
      siteId: "site-123",
    });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult).getData()).toEqual<GetSiteActionsResponseDto>([
      {
        id: "action-1",
        siteId: "site-123",
        actionType: "EVALUATE_COMPATIBILITY",
        status: "todo",
      },
      {
        id: "action-2",
        siteId: "site-123",
        actionType: "REQUEST_FUNDING_INFORMATION",
        status: "done",
      },
    ]);
  });

  it("should return empty array when no actions exist for site", async () => {
    const query = new InMemorySiteActionsQuery([]);
    const usecase = new GetSiteActionsUseCase(query);

    const result = await usecase.execute({
      siteId: "site-123",
    });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult).getData()).toEqual<GetSiteActionsResponseDto>([]);
  });
});
