import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { GetAdminUserResponseDto } from "shared";

import { InMemoryAdminUsersQuery } from "src/admin/adapters/secondary/InMemoryAdminUsersQuery";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";

import { GetAdminUserActivityUseCase } from "./getAdminUserActivity.usecase";

describe("GetAdminUserActivity UseCase", () => {
  it("fails with UserNotFound when user does not exist", async () => {
    const adminUsersQuery = new InMemoryAdminUsersQuery();
    adminUsersQuery._setUserActivities([]);
    const usecase = new GetAdminUserActivityUseCase(adminUsersQuery);

    const result = await usecase.execute({ userId: "unknown-user" });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult<"UserNotFound">).getError(), "UserNotFound");
  });

  it("returns user with login stats, entities and a timeline sorted from newest to oldest", async () => {
    const adminUsersQuery = new InMemoryAdminUsersQuery();
    adminUsersQuery._setUserActivities([
      {
        user: {
          id: "user-1",
          email: "jane@collectivite.fr",
          firstName: "Jane",
          lastName: "Doe",
          structureName: "Mairie de Blajan",
          structureType: "municipality",
          structureActivity: "local_authority",
          subscribedToNewsletter: true,
          createdAt: new Date("2026-01-01T08:00:00.000Z"),
        },
        loginDates: [new Date("2026-01-02T09:00:00.000Z"), new Date("2026-01-20T09:00:00.000Z")],
        sites: [
          {
            id: "site-1",
            name: "Friche industrielle",
            nature: "FRICHE",
            creationMode: "custom",
            status: "active",
            createdAt: new Date("2026-01-03T10:00:00.000Z"),
            updatedAt: new Date("2026-01-10T10:00:00.000Z"),
          },
          {
            id: "site-2",
            name: "Terrain agricole",
            nature: "AGRICULTURAL_OPERATION",
            creationMode: "express",
            status: "active",
            createdAt: new Date("2026-01-04T10:00:00.000Z"),
            updatedAt: null,
          },
        ],
        projects: [
          {
            id: "project-1",
            name: "Centrale PV",
            siteId: "site-1",
            creationMode: "express",
            status: "active",
            createdAt: new Date("2026-01-05T10:00:00.000Z"),
            updatedAt: new Date("2026-01-15T10:00:00.000Z"),
          },
          {
            id: "project-2",
            name: "Quartier mixte",
            siteId: "site-1",
            creationMode: "custom",
            status: "archived",
            createdAt: new Date("2026-01-06T10:00:00.000Z"),
            updatedAt: null,
          },
        ],
        compatibilityEvaluations: [
          {
            id: "evaluation-1",
            siteId: "site-1",
            status: "completed",
            createdAt: new Date("2026-01-07T10:00:00.000Z"),
            completedAt: new Date("2026-01-08T10:00:00.000Z"),
          },
          {
            id: "evaluation-2",
            siteId: null,
            status: null,
            createdAt: new Date("2026-01-09T10:00:00.000Z"),
            completedAt: null,
          },
        ],
      },
    ]);
    const usecase = new GetAdminUserActivityUseCase(adminUsersQuery);

    const result = await usecase.execute({ userId: "user-1" });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<GetAdminUserResponseDto>).getData(), {
      user: {
        id: "user-1",
        email: "jane@collectivite.fr",
        firstName: "Jane",
        lastName: "Doe",
        structureName: "Mairie de Blajan",
        structureType: "municipality",
        structureActivity: "local_authority",
        subscribedToNewsletter: true,
        createdAt: "2026-01-01T08:00:00.000Z",
        lastLoginAt: "2026-01-20T09:00:00.000Z",
        loginCount: 2,
      },
      timeline: [
        { date: "2026-01-20T09:00:00.000Z", type: "login", entityId: null, entityName: null },
        {
          date: "2026-01-15T10:00:00.000Z",
          type: "project_updated",
          entityId: "project-1",
          entityName: "Centrale PV",
        },
        {
          date: "2026-01-10T10:00:00.000Z",
          type: "site_updated",
          entityId: "site-1",
          entityName: "Friche industrielle",
        },
        {
          date: "2026-01-09T10:00:00.000Z",
          type: "compatibility_evaluation_created",
          entityId: "evaluation-2",
          entityName: null,
        },
        {
          date: "2026-01-08T10:00:00.000Z",
          type: "compatibility_evaluation_completed",
          entityId: "evaluation-1",
          entityName: null,
        },
        {
          date: "2026-01-07T10:00:00.000Z",
          type: "compatibility_evaluation_created",
          entityId: "evaluation-1",
          entityName: null,
        },
        {
          date: "2026-01-06T10:00:00.000Z",
          type: "project_created",
          entityId: "project-2",
          entityName: "Quartier mixte",
        },
        {
          date: "2026-01-05T10:00:00.000Z",
          type: "project_created",
          entityId: "project-1",
          entityName: "Centrale PV",
        },
        {
          date: "2026-01-04T10:00:00.000Z",
          type: "site_created",
          entityId: "site-2",
          entityName: "Terrain agricole",
        },
        {
          date: "2026-01-03T10:00:00.000Z",
          type: "site_created",
          entityId: "site-1",
          entityName: "Friche industrielle",
        },
        { date: "2026-01-02T09:00:00.000Z", type: "login", entityId: null, entityName: null },
        {
          date: "2026-01-01T08:00:00.000Z",
          type: "account_created",
          entityId: "user-1",
          entityName: null,
        },
      ],
      sites: [
        {
          id: "site-1",
          name: "Friche industrielle",
          nature: "FRICHE",
          creationMode: "custom",
          status: "active",
          createdAt: "2026-01-03T10:00:00.000Z",
          updatedAt: "2026-01-10T10:00:00.000Z",
        },
        {
          id: "site-2",
          name: "Terrain agricole",
          nature: "AGRICULTURAL_OPERATION",
          creationMode: "express",
          status: "active",
          createdAt: "2026-01-04T10:00:00.000Z",
          updatedAt: null,
        },
      ],
      projects: [
        {
          id: "project-1",
          name: "Centrale PV",
          siteId: "site-1",
          creationMode: "express",
          status: "active",
          createdAt: "2026-01-05T10:00:00.000Z",
          updatedAt: "2026-01-15T10:00:00.000Z",
        },
        {
          id: "project-2",
          name: "Quartier mixte",
          siteId: "site-1",
          creationMode: "custom",
          status: "archived",
          createdAt: "2026-01-06T10:00:00.000Z",
          updatedAt: null,
        },
      ],
      compatibilityEvaluations: [
        {
          id: "evaluation-1",
          siteId: "site-1",
          status: "completed",
          createdAt: "2026-01-07T10:00:00.000Z",
          completedAt: "2026-01-08T10:00:00.000Z",
        },
        {
          id: "evaluation-2",
          siteId: null,
          status: null,
          createdAt: "2026-01-09T10:00:00.000Z",
          completedAt: null,
        },
      ],
    });
  });

  it("reports no login when user never logged in", async () => {
    const adminUsersQuery = new InMemoryAdminUsersQuery();
    adminUsersQuery._setUserActivities([
      {
        user: {
          id: "user-2",
          email: "john@company.fr",
          firstName: null,
          lastName: null,
          structureName: null,
          structureType: "company",
          structureActivity: "urban_planner",
          subscribedToNewsletter: false,
          createdAt: new Date("2026-02-01T08:00:00.000Z"),
        },
        loginDates: [],
        sites: [],
        projects: [],
        compatibilityEvaluations: [],
      },
    ]);
    const usecase = new GetAdminUserActivityUseCase(adminUsersQuery);

    const result = await usecase.execute({ userId: "user-2" });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<GetAdminUserResponseDto>).getData(), {
      user: {
        id: "user-2",
        email: "john@company.fr",
        firstName: null,
        lastName: null,
        structureName: null,
        structureType: "company",
        structureActivity: "urban_planner",
        subscribedToNewsletter: false,
        createdAt: "2026-02-01T08:00:00.000Z",
        lastLoginAt: null,
        loginCount: 0,
      },
      timeline: [
        {
          date: "2026-02-01T08:00:00.000Z",
          type: "account_created",
          entityId: "user-2",
          entityName: null,
        },
      ],
      sites: [],
      projects: [],
      compatibilityEvaluations: [],
    });
  });
});
