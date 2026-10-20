import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AdminUserTimelineEvent, GetAdminUserResponseDto } from "shared";

import { InMemoryAdminUsersQuery } from "src/admin/adapters/secondary/InMemoryAdminUsersQuery";
import type {
  AdminUserActivityRecord,
  AdminUserLifecycleEmailDeliveryRecord,
} from "src/admin/core/gateways/AdminUsersQuery";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";

import { GetAdminUserActivityUseCase } from "./getAdminUserActivity.usecase";

const USER_CREATED_AT = new Date("2026-01-01T08:00:00.000Z");

const buildActivity = (
  overrides: Partial<Omit<AdminUserActivityRecord, "user">> & {
    lifecycleEmailsUnsubscribedAt?: Date | null;
  },
): AdminUserActivityRecord => {
  const { lifecycleEmailsUnsubscribedAt = null, ...activity } = overrides;
  return {
    user: {
      id: "user-1",
      email: "jane@collectivite.fr",
      firstName: "Jane",
      lastName: "Doe",
      structureName: "Mairie de Blajan",
      structureType: "municipality",
      structureActivity: "local_authority",
      subscribedToNewsletter: false,
      lifecycleEmailsUnsubscribedAt,
      createdAt: USER_CREATED_AT,
    },
    loginDates: [],
    sites: [],
    projects: [],
    compatibilityEvaluations: [],
    lifecycleEmailDeliveries: [],
    ...activity,
  };
};

const ACCOUNT_CREATED_EVENT = {
  date: "2026-01-01T08:00:00.000Z",
  type: "account_created",
  entityId: "user-1",
  entityName: null,
  emailType: null,
  deliveryStatus: null,
  deliveryAttempts: null,
  deliveryErrorMessage: null,
} as const satisfies AdminUserTimelineEvent;

const getTimeline = async (activity: AdminUserActivityRecord) => {
  const adminUsersQuery = new InMemoryAdminUsersQuery();
  adminUsersQuery._setUserActivities([activity]);
  const usecase = new GetAdminUserActivityUseCase(adminUsersQuery);
  const result = await usecase.execute({ userId: "user-1" });
  return (result as SuccessResult<GetAdminUserResponseDto>).getData().timeline;
};

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
          lifecycleEmailsUnsubscribedAt: null,
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
        lifecycleEmailDeliveries: [],
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
        {
          date: "2026-01-20T09:00:00.000Z",
          type: "login",
          entityId: null,
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-15T10:00:00.000Z",
          type: "project_updated",
          entityId: "project-1",
          entityName: "Centrale PV",
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-10T10:00:00.000Z",
          type: "site_updated",
          entityId: "site-1",
          entityName: "Friche industrielle",
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-09T10:00:00.000Z",
          type: "compatibility_evaluation_created",
          entityId: "evaluation-2",
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-08T10:00:00.000Z",
          type: "compatibility_evaluation_completed",
          entityId: "evaluation-1",
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-07T10:00:00.000Z",
          type: "compatibility_evaluation_created",
          entityId: "evaluation-1",
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-06T10:00:00.000Z",
          type: "project_created",
          entityId: "project-2",
          entityName: "Quartier mixte",
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-05T10:00:00.000Z",
          type: "project_created",
          entityId: "project-1",
          entityName: "Centrale PV",
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-04T10:00:00.000Z",
          type: "site_created",
          entityId: "site-2",
          entityName: "Terrain agricole",
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-03T10:00:00.000Z",
          type: "site_created",
          entityId: "site-1",
          entityName: "Friche industrielle",
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-02T09:00:00.000Z",
          type: "login",
          entityId: null,
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-01T08:00:00.000Z",
          type: "account_created",
          entityId: "user-1",
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
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
          lifecycleEmailsUnsubscribedAt: null,
          createdAt: new Date("2026-02-01T08:00:00.000Z"),
        },
        loginDates: [],
        sites: [],
        projects: [],
        compatibilityEvaluations: [],
        lifecycleEmailDeliveries: [],
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
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
      ],
      sites: [],
      projects: [],
      compatibilityEvaluations: [],
    });
  });

  describe("lifecycle emails", () => {
    it("adds a lifecycle_email_sent event dated at the send date", async () => {
      const delivery: AdminUserLifecycleEmailDeliveryRecord = {
        emailType: "welcome",
        status: "sent",
        relatedEntityName: null,
        sentAt: new Date("2026-01-01T08:01:00.000Z"),
        lastAttemptedAt: new Date("2026-01-01T08:00:30.000Z"),
        attempts: 1,
        errorMessage: null,
      };

      const timeline = await getTimeline(buildActivity({ lifecycleEmailDeliveries: [delivery] }));

      assert.deepStrictEqual(timeline, [
        {
          date: "2026-01-01T08:01:00.000Z",
          type: "lifecycle_email_sent",
          entityId: null,
          entityName: null,
          emailType: "welcome",
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        ACCOUNT_CREATED_EVENT,
      ] satisfies AdminUserTimelineEvent[]);
    });

    for (const status of ["failed", "abandoned"] as const) {
      it(`adds a lifecycle_email_failed event dated at the last attempt for a ${status} delivery`, async () => {
        const delivery: AdminUserLifecycleEmailDeliveryRecord = {
          emailType: "first-site-reminder",
          status,
          relatedEntityName: null,
          sentAt: null,
          lastAttemptedAt: new Date("2026-01-05T10:00:00.000Z"),
          attempts: 2,
          errorMessage: "Connection timeout",
        };

        const timeline = await getTimeline(buildActivity({ lifecycleEmailDeliveries: [delivery] }));

        assert.deepStrictEqual(timeline, [
          {
            date: "2026-01-05T10:00:00.000Z",
            type: "lifecycle_email_failed",
            entityId: null,
            entityName: null,
            emailType: "first-site-reminder",
            deliveryStatus: status,
            deliveryAttempts: 2,
            deliveryErrorMessage: "Connection timeout",
          },
          ACCOUNT_CREATED_EVENT,
        ] satisfies AdminUserTimelineEvent[]);
      });
    }

    it("ignores pending deliveries", async () => {
      const delivery: AdminUserLifecycleEmailDeliveryRecord = {
        emailType: "welcome",
        status: "pending",
        relatedEntityName: null,
        sentAt: null,
        lastAttemptedAt: new Date("2026-01-01T08:00:30.000Z"),
        attempts: 0,
        errorMessage: null,
      };

      const timeline = await getTimeline(buildActivity({ lifecycleEmailDeliveries: [delivery] }));

      assert.deepStrictEqual(timeline, [ACCOUNT_CREATED_EVENT] satisfies AdminUserTimelineEvent[]);
    });

    it("adds a lifecycle_emails_unsubscribed event at the unsubscribe date", async () => {
      const timeline = await getTimeline(
        buildActivity({ lifecycleEmailsUnsubscribedAt: new Date("2026-02-01T12:00:00.000Z") }),
      );

      assert.deepStrictEqual(timeline, [
        {
          date: "2026-02-01T12:00:00.000Z",
          type: "lifecycle_emails_unsubscribed",
          entityId: null,
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        ACCOUNT_CREATED_EVENT,
      ] satisfies AdminUserTimelineEvent[]);
    });

    it("carries the resolved site or project name on entity-scoped emails", async () => {
      const timeline = await getTimeline(
        buildActivity({
          lifecycleEmailDeliveries: [
            {
              emailType: "first-project-reminder",
              status: "sent",
              relatedEntityName: "Friche Duval",
              sentAt: new Date("2026-01-03T10:00:00.000Z"),
              lastAttemptedAt: new Date("2026-01-03T10:00:00.000Z"),
              attempts: 1,
              errorMessage: null,
            },
            {
              emailType: "project-impacts-summary",
              status: "sent",
              relatedEntityName: "Parking Sud",
              sentAt: new Date("2026-01-04T10:00:00.000Z"),
              lastAttemptedAt: new Date("2026-01-04T10:00:00.000Z"),
              attempts: 1,
              errorMessage: null,
            },
          ],
        }),
      );

      assert.deepStrictEqual(timeline, [
        {
          date: "2026-01-04T10:00:00.000Z",
          type: "lifecycle_email_sent",
          entityId: null,
          entityName: "Parking Sud",
          emailType: "project-impacts-summary",
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-03T10:00:00.000Z",
          type: "lifecycle_email_sent",
          entityId: null,
          entityName: "Friche Duval",
          emailType: "first-project-reminder",
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        ACCOUNT_CREATED_EVENT,
      ] satisfies AdminUserTimelineEvent[]);
    });

    it("emits an entity-scoped email without name when the entity no longer exists", async () => {
      const delivery: AdminUserLifecycleEmailDeliveryRecord = {
        emailType: "project-impacts-summary",
        status: "sent",
        relatedEntityName: null,
        sentAt: new Date("2026-01-04T10:00:00.000Z"),
        lastAttemptedAt: new Date("2026-01-04T10:00:00.000Z"),
        attempts: 1,
        errorMessage: null,
      };

      const timeline = await getTimeline(buildActivity({ lifecycleEmailDeliveries: [delivery] }));

      assert.deepStrictEqual(timeline, [
        {
          date: "2026-01-04T10:00:00.000Z",
          type: "lifecycle_email_sent",
          entityId: null,
          entityName: null,
          emailType: "project-impacts-summary",
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        ACCOUNT_CREATED_EVENT,
      ] satisfies AdminUserTimelineEvent[]);
    });

    it("interleaves email events chronologically with activity events", async () => {
      const timeline = await getTimeline(
        buildActivity({
          lifecycleEmailsUnsubscribedAt: new Date("2026-01-15T10:00:00.000Z"),
          loginDates: [new Date("2026-01-10T10:00:00.000Z")],
          sites: [
            {
              id: "site-1",
              name: "Friche Duval",
              nature: "FRICHE",
              creationMode: "custom",
              status: "active",
              createdAt: new Date("2026-01-07T10:00:00.000Z"),
              updatedAt: null,
            },
          ],
          lifecycleEmailDeliveries: [
            {
              emailType: "welcome",
              status: "sent",
              relatedEntityName: null,
              sentAt: new Date("2026-01-05T10:00:00.000Z"),
              lastAttemptedAt: new Date("2026-01-05T10:00:00.000Z"),
              attempts: 1,
              errorMessage: null,
            },
            {
              emailType: "first-project-reminder",
              status: "failed",
              relatedEntityName: "Friche Duval",
              sentAt: null,
              lastAttemptedAt: new Date("2026-01-12T10:00:00.000Z"),
              attempts: 1,
              errorMessage: "Connection timeout",
            },
          ],
        }),
      );

      assert.deepStrictEqual(timeline, [
        {
          date: "2026-01-15T10:00:00.000Z",
          type: "lifecycle_emails_unsubscribed",
          entityId: null,
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-12T10:00:00.000Z",
          type: "lifecycle_email_failed",
          entityId: null,
          entityName: "Friche Duval",
          emailType: "first-project-reminder",
          deliveryStatus: "failed",
          deliveryAttempts: 1,
          deliveryErrorMessage: "Connection timeout",
        },
        {
          date: "2026-01-10T10:00:00.000Z",
          type: "login",
          entityId: null,
          entityName: null,
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-07T10:00:00.000Z",
          type: "site_created",
          entityId: "site-1",
          entityName: "Friche Duval",
          emailType: null,
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        {
          date: "2026-01-05T10:00:00.000Z",
          type: "lifecycle_email_sent",
          entityId: null,
          entityName: null,
          emailType: "welcome",
          deliveryStatus: null,
          deliveryAttempts: null,
          deliveryErrorMessage: null,
        },
        ACCOUNT_CREATED_EVENT,
      ] satisfies AdminUserTimelineEvent[]);
    });
  });
});
