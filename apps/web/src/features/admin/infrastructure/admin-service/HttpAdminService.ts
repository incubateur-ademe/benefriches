import {
  getAdminDashboardStatsResponseDtoSchema,
  getAdminUserResponseDtoSchema,
  listAdminUsersResponseDtoSchema,
} from "shared";

import type {
  AdminDashboardStats,
  AdminUserActivity,
  AdminUsersList,
} from "../../core/admin.types";
import {
  AdminGateway,
  AdminUserNotFoundError,
  ListAdminUsersParams,
} from "../../core/gateways/AdminGateway";

export class HttpAdminService implements AdminGateway {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await fetch("/api/admin/stats");

    if (!response.ok) throw new Error("Error while fetching admin dashboard stats");

    const jsonResponse: unknown = await response.json();
    const result = getAdminDashboardStatsResponseDtoSchema.safeParse(jsonResponse);

    if (!result.success) throw new Error("HttpAdminService: Invalid dashboard stats response");

    return result.data;
  }

  async listUsers({ search, page }: ListAdminUsersParams): Promise<AdminUsersList> {
    const searchParams = new URLSearchParams();
    if (search) searchParams.set("search", search);
    if (page) searchParams.set("page", String(page));
    const query = searchParams.toString();

    const response = await fetch(`/api/admin/users${query ? `?${query}` : ""}`);

    if (!response.ok) throw new Error("Error while fetching admin users list");

    const jsonResponse: unknown = await response.json();
    const result = listAdminUsersResponseDtoSchema.safeParse(jsonResponse);

    if (!result.success) throw new Error("HttpAdminService: Invalid users list response");

    return result.data;
  }

  async getUserActivity(userId: string): Promise<AdminUserActivity> {
    const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`);

    if (response.status === 404) throw new AdminUserNotFoundError(userId);
    if (!response.ok) throw new Error("Error while fetching admin user activity");

    const jsonResponse: unknown = await response.json();
    const result = getAdminUserResponseDtoSchema.safeParse(jsonResponse);

    if (!result.success) throw new Error("HttpAdminService: Invalid user activity response");

    return result.data;
  }
}
