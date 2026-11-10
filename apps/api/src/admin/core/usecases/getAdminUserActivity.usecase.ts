import type { AdminUserTimelineEvent, GetAdminUserResponseDto } from "shared";

import { LIFECYCLE_EMAIL_MAX_ATTEMPTS } from "src/notifications/core/models/lifecycleEmail";
import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { AdminUsersQuery } from "../gateways/AdminUsersQuery";
import type { AdminUserActivityRecord } from "../models/adminUserReadModel";

type Request = { userId: string };

export const buildUserTimeline = (activity: AdminUserActivityRecord): AdminUserTimelineEvent[] => {
  const events: AdminUserTimelineEvent[] = [
    { type: "account_created", date: activity.user.createdAt.toISOString() },
  ];

  activity.loginDates.forEach((date) => {
    events.push({ type: "login", date: date.toISOString() });
  });

  activity.sites.forEach((site) => {
    events.push({
      type: "site_created",
      date: site.createdAt.toISOString(),
      entityId: site.id,
      entityName: site.name,
    });
    if (site.updatedAt) {
      events.push({
        type: "site_updated",
        date: site.updatedAt.toISOString(),
        entityId: site.id,
        entityName: site.name,
      });
    }
  });

  activity.projects.forEach((project) => {
    events.push({
      type: "project_created",
      date: project.createdAt.toISOString(),
      entityId: project.id,
      entityName: project.name,
    });
    if (project.updatedAt) {
      events.push({
        type: "project_updated",
        date: project.updatedAt.toISOString(),
        entityId: project.id,
        entityName: project.name,
      });
    }
  });

  activity.compatibilityEvaluations.forEach((evaluation) => {
    events.push({
      type: "compatibility_evaluation_created",
      date: evaluation.createdAt.toISOString(),
      entityId: evaluation.id,
    });
    if (evaluation.completedAt) {
      events.push({
        type: "compatibility_evaluation_completed",
        date: evaluation.completedAt.toISOString(),
        entityId: evaluation.id,
      });
    }
  });

  activity.lifecycleEmailDeliveries.forEach((delivery) => {
    switch (delivery.status) {
      case "sent":
        events.push({
          type: "lifecycle_email_sent",
          // sent_at is always set on a sent delivery; the fallback only satisfies the type.
          date: (delivery.sentAt ?? delivery.lastAttemptedAt).toISOString(),
          emailType: delivery.emailType,
          entityName: delivery.relatedEntityName,
        });
        break;
      case "failed":
      case "abandoned":
        events.push({
          type: "lifecycle_email_failed",
          date: delivery.lastAttemptedAt.toISOString(),
          emailType: delivery.emailType,
          entityName: delivery.relatedEntityName,
          deliveryStatus: delivery.status,
          deliveryAttempts: delivery.attempts,
          deliveryErrorMessage: delivery.errorMessage,
        });
        break;
      case "pending":
        break;
    }
  });

  activity.impactsExports.forEach((impactsExport) => {
    events.push({
      type: "impacts_exported",
      date: impactsExport.exportedAt.toISOString(),
      entityId: impactsExport.projectId,
      entityName: impactsExport.projectName,
      impactsExportFormat: impactsExport.format,
      entityArchived: impactsExport.projectArchived,
    });
  });

  if (activity.user.lifecycleEmailsUnsubscribedAt) {
    events.push({
      type: "lifecycle_emails_unsubscribed",
      date: activity.user.lifecycleEmailsUnsubscribedAt.toISOString(),
    });
  }

  return events.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
      lifecycleEmailMaxAttempts: LIFECYCLE_EMAIL_MAX_ATTEMPTS,
    });
  }
}
