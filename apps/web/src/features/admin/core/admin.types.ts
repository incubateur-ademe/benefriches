export type {
  AdminMonthlyStats,
  AdminUserCompatibilityEvaluation,
  AdminUserProject,
  AdminUserSite,
  AdminUserSummary,
  AdminUserTimelineEvent,
  AdminUserTimelineEventType,
  GetAdminDashboardStatsResponseDto as AdminDashboardStats,
  GetAdminUserResponseDto as AdminUserActivity,
  ListAdminUsersResponseDto as AdminUsersList,
} from "shared";

export type LoadingState = "idle" | "loading" | "success" | "error";
