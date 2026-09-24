import { z } from "zod";

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

export const adminUserTimelineEventTypeSchema = z.enum([
  "account_created",
  "login",
  "site_created",
  "site_updated",
  "project_created",
  "project_updated",
  "compatibility_evaluation_created",
  "compatibility_evaluation_completed",
]);
export type AdminUserTimelineEventType = z.infer<typeof adminUserTimelineEventTypeSchema>;

export const adminUserTimelineEventSchema = z.object({
  date: isoDateSchema,
  type: adminUserTimelineEventTypeSchema,
  entityId: z.string().nullable(),
  entityName: z.string().nullable(),
});
export type AdminUserTimelineEvent = z.infer<typeof adminUserTimelineEventSchema>;

export const adminUserSiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  nature: z.string(),
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
  creationMode: z.string(),
  status: z.string(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema.nullable(),
});
export type AdminUserProject = z.infer<typeof adminUserProjectSchema>;

export const adminUserCompatibilityEvaluationSchema = z.object({
  id: z.string(),
  siteId: z.string().nullable(),
  status: z.string().nullable(),
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
});
export type GetAdminUserResponseDto = z.infer<typeof getAdminUserResponseDtoSchema>;
