import { z } from "zod";

import {
  lifecycleEmailDeliveryStatusSchema,
  lifecycleEmailTypeSchema,
} from "../../lifecycle-emails";
import { reconversionCompatibilityEvaluationStatusSchema } from "../../reconversion-compatibility";
import { impactsExportFormatSchema } from "../../reconversion-project-impacts/impacts-export";
import { reconversionProjectCreationModeSchema } from "../../reconversion-projects/_common/creationMode";
import { siteNatureSchema } from "../../site";

const isoDateSchema = z.string();

export const adminMonthlyStatsSchema = z.object({
  month: z.string(), // "YYYY-MM"
  usersCreated: z.number(),
  sitesCreated: z.number(),
  projectsCreated: z.number(),
  compatibilityEvaluationsCreated: z.number(),
  logins: z.number(),
});
export type AdminMonthlyStats = z.infer<typeof adminMonthlyStatsSchema>;

export const getAdminDashboardStatsResponseDtoSchema = z.object({
  totals: z.object({
    users: z.number(),
    sites: z.number(),
    projects: z.number(),
    compatibilityEvaluations: z.number(),
  }),
  currentMonth: adminMonthlyStatsSchema,
  monthly: z.array(adminMonthlyStatsSchema),
});
export type GetAdminDashboardStatsResponseDto = z.infer<
  typeof getAdminDashboardStatsResponseDtoSchema
>;

export const listAdminUsersRequestDtoSchema = z.object({
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
});
export type ListAdminUsersRequestDto = z.infer<typeof listAdminUsersRequestDtoSchema>;

export const adminUserIdParamSchema = z.uuid();
export type AdminUserIdParam = z.infer<typeof adminUserIdParamSchema>;

export const adminUserSummarySchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  structureName: z.string().nullable(),
  structureType: z.string(),
  structureActivity: z.string(),
  createdAt: isoDateSchema,
  lastLoginAt: isoDateSchema.nullable(),
});
export type AdminUserSummary = z.infer<typeof adminUserSummarySchema>;

export const listAdminUsersResponseDtoSchema = z.object({
  users: z.array(adminUserSummarySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});
export type ListAdminUsersResponseDto = z.infer<typeof listAdminUsersResponseDtoSchema>;

const timelineEventBaseSchema = z.object({ date: isoDateSchema });

const timelineEntityEventSchema = timelineEventBaseSchema.extend({
  entityId: z.string(),
  entityName: z.string(),
});

export const adminUserTimelineEventSchema = z.discriminatedUnion("type", [
  timelineEventBaseSchema.extend({
    type: z.literal("account_created"),
  }),
  timelineEventBaseSchema.extend({
    type: z.literal("login"),
  }),
  timelineEntityEventSchema.extend({
    type: z.literal(["site_created", "site_updated", "project_created", "project_updated"]),
  }),
  timelineEventBaseSchema.extend({
    type: z.literal(["compatibility_evaluation_created", "compatibility_evaluation_completed"]),
    entityId: z.string(),
  }),
  timelineEventBaseSchema.extend({
    type: z.literal("lifecycle_email_sent"),
    emailType: lifecycleEmailTypeSchema,
    // Site or project the email is about; null when it isn't about one or it was deleted.
    entityName: z.string().nullable(),
  }),
  timelineEventBaseSchema.extend({
    type: z.literal("lifecycle_email_failed"),
    emailType: lifecycleEmailTypeSchema,
    entityName: z.string().nullable(),
    deliveryStatus: lifecycleEmailDeliveryStatusSchema.extract(["failed", "abandoned"]),
    deliveryAttempts: z.number(),
    deliveryErrorMessage: z.string().nullable(),
  }),
  timelineEventBaseSchema.extend({
    type: z.literal("lifecycle_emails_unsubscribed"),
  }),
  timelineEntityEventSchema.extend({
    type: z.literal("impacts_exported"),
    impactsExportFormat: impactsExportFormatSchema,
    entityArchived: z.boolean(),
  }),
]);
export type AdminUserTimelineEvent = z.infer<typeof adminUserTimelineEventSchema>;
export type AdminUserTimelineEventType = AdminUserTimelineEvent["type"];

export const adminUserSiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  nature: siteNatureSchema,
  creationMode: z.string(),
  status: z.string(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema.nullable(),
});
export type AdminUserSite = z.infer<typeof adminUserSiteSchema>;

export const adminUserProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  siteId: z.string(),
  creationMode: reconversionProjectCreationModeSchema,
  status: z.string(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema.nullable(),
});
export type AdminUserProject = z.infer<typeof adminUserProjectSchema>;

export const adminUserCompatibilityEvaluationSchema = z.object({
  id: z.string(),
  siteId: z.string().nullable(),
  status: reconversionCompatibilityEvaluationStatusSchema.nullable(),
  createdAt: isoDateSchema,
  completedAt: isoDateSchema.nullable(),
});
export type AdminUserCompatibilityEvaluation = z.infer<
  typeof adminUserCompatibilityEvaluationSchema
>;

export const getAdminUserResponseDtoSchema = z.object({
  user: adminUserSummarySchema.extend({
    loginCount: z.number(),
    subscribedToNewsletter: z.boolean(),
  }),
  timeline: z.array(adminUserTimelineEventSchema),
  sites: z.array(adminUserSiteSchema),
  projects: z.array(adminUserProjectSchema),
  compatibilityEvaluations: z.array(adminUserCompatibilityEvaluationSchema),
  lifecycleEmailMaxAttempts: z.number(),
});
export type GetAdminUserResponseDto = z.infer<typeof getAdminUserResponseDtoSchema>;

export const listAdminImpactsExportersRequestDtoSchema = listAdminUsersRequestDtoSchema;
export type ListAdminImpactsExportersRequestDto = z.infer<
  typeof listAdminImpactsExportersRequestDtoSchema
>;

export const adminImpactsExporterSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  structureName: z.string().nullable(),
  impactsExportsCount: z.number(),
  exportedProjectsCount: z.number(),
  lastImpactsExportedAt: isoDateSchema,
});
export type AdminImpactsExporter = z.infer<typeof adminImpactsExporterSchema>;

export const listAdminImpactsExportersResponseDtoSchema = z.object({
  users: z.array(adminImpactsExporterSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});
export type ListAdminImpactsExportersResponseDto = z.infer<
  typeof listAdminImpactsExportersResponseDtoSchema
>;
