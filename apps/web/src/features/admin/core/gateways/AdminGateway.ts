import type { AdminDashboardStats, AdminUserActivity, AdminUsersList } from "../admin.types";

export type ListAdminUsersParams = {
  search?: string;
  page?: number;
};

export class AdminUserNotFoundError extends Error {
  constructor(userId: string) {
    super(`Admin user not found: ${userId}`);
    this.name = "AdminUserNotFoundError";
  }
}

export interface AdminGateway {
  getDashboardStats(): Promise<AdminDashboardStats>;
  listUsers(params: ListAdminUsersParams): Promise<AdminUsersList>;
  getUserActivity(userId: string): Promise<AdminUserActivity>;
}
