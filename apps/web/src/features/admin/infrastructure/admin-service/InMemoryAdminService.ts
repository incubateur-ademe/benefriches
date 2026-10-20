import type {
  AdminDashboardStats,
  AdminUserActivity,
  AdminUsersList,
} from "../../core/admin.types";
import {
  type AdminGateway,
  AdminUserNotFoundError,
  type ListAdminUsersParams,
} from "../../core/gateways/AdminGateway";

type InMemoryAdminServiceOptions = {
  dashboardStats?: AdminDashboardStats;
  usersList?: AdminUsersList;
  userActivities?: Record<string, AdminUserActivity>;
  shouldFail?: boolean;
};

const EMPTY_MONTH = {
  month: "2026-09",
  usersCreated: 0,
  sitesCreated: 0,
  projectsCreated: 0,
  compatibilityEvaluationsCreated: 0,
  logins: 0,
};

export class InMemoryAdminService implements AdminGateway {
  private readonly dashboardStats: AdminDashboardStats;
  private readonly usersList: AdminUsersList;
  private readonly userActivities: Record<string, AdminUserActivity>;
  private readonly shouldFail: boolean;

  constructor({
    dashboardStats,
    usersList,
    userActivities,
    shouldFail = false,
  }: InMemoryAdminServiceOptions = {}) {
    this.dashboardStats = dashboardStats ?? {
      totals: { users: 0, sites: 0, projects: 0, compatibilityEvaluations: 0 },
      currentMonth: EMPTY_MONTH,
      monthly: [],
    };
    this.usersList = usersList ?? { users: [], total: 0, page: 1, pageSize: 25 };
    this.userActivities = userActivities ?? {};
    this.shouldFail = shouldFail;
  }

  getDashboardStats(): Promise<AdminDashboardStats> {
    if (this.shouldFail) return Promise.reject(new Error("Intended error"));
    return Promise.resolve(this.dashboardStats);
  }

  listUsers(_params: ListAdminUsersParams): Promise<AdminUsersList> {
    if (this.shouldFail) return Promise.reject(new Error("Intended error"));
    return Promise.resolve(this.usersList);
  }

  getUserActivity(userId: string): Promise<AdminUserActivity> {
    if (this.shouldFail) return Promise.reject(new Error("Intended error"));
    const activity = this.userActivities[userId];
    if (!activity) return Promise.reject(new AdminUserNotFoundError(userId));
    return Promise.resolve(activity);
  }
}
