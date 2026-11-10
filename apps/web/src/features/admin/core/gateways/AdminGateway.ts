import type {
  AdminDashboardStats,
  AdminImpactsExportersList,
  AdminUserActivity,
  AdminUsersList,
} from "../admin.types";

export type ListAdminUsersParams = {
  search?: string;
  page?: number;
};

export type ListAdminImpactsExportersParams = {
  search?: string;
  page?: number;
};

export class AdminUserNotFoundError extends Error {
  constructor(userId: string) {
    super(`Admin user not found: ${userId}`);
    this.name = "AdminUserNotFoundError";
  }
}

export class AdminAccessForbiddenError extends Error {
  constructor() {
    super("Admin access forbidden");
    this.name = "AdminAccessForbiddenError";
  }
}

export interface AdminGateway {
  getDashboardStats(): Promise<AdminDashboardStats>;
  listUsers(params: ListAdminUsersParams): Promise<AdminUsersList>;
  getUserActivity(userId: string): Promise<AdminUserActivity>;
  listImpactsExporters(params: ListAdminImpactsExportersParams): Promise<AdminImpactsExportersList>;
}
