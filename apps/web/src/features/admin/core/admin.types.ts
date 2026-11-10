export type {
  AdminImpactsExporter,
  AdminMonthlyStats,
  AdminUserCompatibilityEvaluation,
  AdminUserProject,
  AdminUserSite,
  AdminUserSummary,
  AdminUserTimelineEvent,
  AdminUserTimelineEventType,
  GetAdminDashboardStatsResponseDto as AdminDashboardStats,
  GetAdminUserResponseDto as AdminUserActivity,
  ListAdminImpactsExportersResponseDto as AdminImpactsExportersList,
  ListAdminUsersResponseDto as AdminUsersList,
} from "shared";

export type LoadingState = "idle" | "loading" | "success" | "error";

export type AdminLoadingState = LoadingState | "forbidden";
