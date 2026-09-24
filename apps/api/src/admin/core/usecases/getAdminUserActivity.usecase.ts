import type { AdminUserTimelineEvent, GetAdminUserResponseDto } from "shared";

import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { AdminUserActivityRecord, AdminUsersQuery } from "../gateways/AdminUsersQuery";

type Request = { userId: string };

export const buildUserTimeline = (activity: AdminUserActivityRecord): AdminUserTimelineEvent[] => {
  const events: { date: Date; event: Omit<AdminUserTimelineEvent, "date"> }[] = [];

  events.push({
    date: activity.user.createdAt,
    event: { type: "account_created", entityId: activity.user.id, entityName: null },
  });

  activity.loginDates.forEach((date) => {
    events.push({ date, event: { type: "login", entityId: null, entityName: null } });
  });

  activity.sites.forEach((site) => {
    events.push({
      date: site.createdAt,
      event: { type: "site_created", entityId: site.id, entityName: site.name },
    });
    if (site.updatedAt) {
      events.push({
        date: site.updatedAt,
        event: { type: "site_updated", entityId: site.id, entityName: site.name },
      });
    }
  });

  activity.projects.forEach((project) => {
    events.push({
      date: project.createdAt,
      event: { type: "project_created", entityId: project.id, entityName: project.name },
    });
    if (project.updatedAt) {
      events.push({
        date: project.updatedAt,
        event: { type: "project_updated", entityId: project.id, entityName: project.name },
      });
    }
  });

  activity.compatibilityEvaluations.forEach((evaluation) => {
    events.push({
      date: evaluation.createdAt,
      event: {
        type: "compatibility_evaluation_created",
        entityId: evaluation.id,
        entityName: null,
      },
    });
    if (evaluation.completedAt) {
      events.push({
        date: evaluation.completedAt,
        event: {
          type: "compatibility_evaluation_completed",
          entityId: evaluation.id,
          entityName: null,
        },
      });
    }
  });

  return events
    .toSorted((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ date, event }) => ({
      date: date.toISOString(),
      type: event.type,
      entityId: event.entityId,
      entityName: event.entityName,
    }));
};

export class GetAdminUserActivityUseCase implements UseCase<
  Request,
  TResult<GetAdminUserResponseDto, "UserNotFound">
> {
  private readonly adminUsersQuery: AdminUsersQuery;

  constructor(adminUsersQuery: AdminUsersQuery) {
    this.adminUsersQuery = adminUsersQuery;
  }

  async execute({ userId }: Request): Promise<TResult<GetAdminUserResponseDto, "UserNotFound">> {
    const activity = await this.adminUsersQuery.getUserActivity(userId);

    if (!activity) return fail("UserNotFound");

    const lastLoginDate = activity.loginDates.reduce<Date | null>(
      (latest, date) => (latest === null || date > latest ? date : latest),
      null,
    );

    return success({
      user: {
        id: activity.user.id,
        email: activity.user.email,
        firstName: activity.user.firstName,
        lastName: activity.user.lastName,
        structureName: activity.user.structureName,
        structureType: activity.user.structureType,
        structureActivity: activity.user.structureActivity,
        subscribedToNewsletter: activity.user.subscribedToNewsletter,
        createdAt: activity.user.createdAt.toISOString(),
        lastLoginAt: lastLoginDate?.toISOString() ?? null,
        loginCount: activity.loginDates.length,
      },
      timeline: buildUserTimeline(activity),
      sites: activity.sites.map((site) => ({
        id: site.id,
        name: site.name,
        nature: site.nature,
        creationMode: site.creationMode,
        status: site.status,
        createdAt: site.createdAt.toISOString(),
        updatedAt: site.updatedAt?.toISOString() ?? null,
      })),
      projects: activity.projects.map((project) => ({
        id: project.id,
        name: project.name,
        siteId: project.siteId,
        creationMode: project.creationMode,
        status: project.status,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt?.toISOString() ?? null,
      })),
      compatibilityEvaluations: activity.compatibilityEvaluations.map((evaluation) => ({
        id: evaluation.id,
        siteId: evaluation.siteId,
        status: evaluation.status,
        createdAt: evaluation.createdAt.toISOString(),
        completedAt: evaluation.completedAt?.toISOString() ?? null,
      })),
    });
  }
}
