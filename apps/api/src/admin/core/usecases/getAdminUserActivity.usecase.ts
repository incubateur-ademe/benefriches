import type { AdminUserTimelineEvent, GetAdminUserResponseDto } from "shared";

import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { AdminUserActivityRecord, AdminUsersQuery } from "../gateways/AdminUsersQuery";

type Request = { userId: string };

const NO_EMAIL_FIELDS = {
  emailType: null,
  deliveryStatus: null,
  deliveryAttempts: null,
  deliveryErrorMessage: null,
} as const;

export const buildUserTimeline = (activity: AdminUserActivityRecord): AdminUserTimelineEvent[] => {
  const events: { date: Date; event: Omit<AdminUserTimelineEvent, "date"> }[] = [];

  events.push({
    date: activity.user.createdAt,
    event: {
      type: "account_created",
      entityId: activity.user.id,
      entityName: null,
      ...NO_EMAIL_FIELDS,
    },
  });

  activity.loginDates.forEach((date) => {
    events.push({
      date,
      event: { type: "login", entityId: null, entityName: null, ...NO_EMAIL_FIELDS },
    });
  });

  activity.sites.forEach((site) => {
    events.push({
      date: site.createdAt,
      event: { type: "site_created", entityId: site.id, entityName: site.name, ...NO_EMAIL_FIELDS },
    });
    if (site.updatedAt) {
      events.push({
        date: site.updatedAt,
        event: {
          type: "site_updated",
          entityId: site.id,
          entityName: site.name,
          ...NO_EMAIL_FIELDS,
        },
      });
    }
  });

  activity.projects.forEach((project) => {
    events.push({
      date: project.createdAt,
      event: {
        type: "project_created",
        entityId: project.id,
        entityName: project.name,
        ...NO_EMAIL_FIELDS,
      },
    });
    if (project.updatedAt) {
      events.push({
        date: project.updatedAt,
        event: {
          type: "project_updated",
          entityId: project.id,
          entityName: project.name,
          ...NO_EMAIL_FIELDS,
        },
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
        ...NO_EMAIL_FIELDS,
      },
    });
    if (evaluation.completedAt) {
      events.push({
        date: evaluation.completedAt,
        event: {
          type: "compatibility_evaluation_completed",
          entityId: evaluation.id,
          entityName: null,
          ...NO_EMAIL_FIELDS,
        },
      });
    }
  });

  activity.lifecycleEmailDeliveries.forEach((delivery) => {
    switch (delivery.status) {
      case "sent":
        events.push({
          // sent_at is always set on a sent delivery; the fallback only satisfies the type.
          date: delivery.sentAt ?? delivery.lastAttemptedAt,
          event: {
            type: "lifecycle_email_sent",
            entityId: null,
            entityName: delivery.relatedEntityName,
            emailType: delivery.emailType,
            deliveryStatus: null,
            deliveryAttempts: null,
            deliveryErrorMessage: null,
          },
        });
        break;
      case "failed":
      case "abandoned":
        events.push({
          date: delivery.lastAttemptedAt,
          event: {
            type: "lifecycle_email_failed",
            entityId: null,
            entityName: delivery.relatedEntityName,
            emailType: delivery.emailType,
            deliveryStatus: delivery.status,
            deliveryAttempts: delivery.attempts,
            deliveryErrorMessage: delivery.errorMessage,
          },
        });
        break;
      case "pending":
        break;
    }
  });

  if (activity.user.lifecycleEmailsUnsubscribedAt) {
    events.push({
      date: activity.user.lifecycleEmailsUnsubscribedAt,
      event: {
        type: "lifecycle_emails_unsubscribed",
        entityId: null,
        entityName: null,
        ...NO_EMAIL_FIELDS,
      },
    });
  }

  return events
    .toSorted((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ date, event }) => ({
      date: date.toISOString(),
      type: event.type,
      entityId: event.entityId,
      entityName: event.entityName,
      emailType: event.emailType,
      deliveryStatus: event.deliveryStatus,
      deliveryAttempts: event.deliveryAttempts,
      deliveryErrorMessage: event.deliveryErrorMessage,
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
