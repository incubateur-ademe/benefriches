import type { AdminUserActivityRecord, AdminUserListItem } from "../models/adminUserReadModel";

export interface AdminUsersQuery {
  list(props: { search?: string; page: number; pageSize: number }): Promise<{
    users: AdminUserListItem[];
    total: number;
  }>;
  getUserActivity(userId: string): Promise<AdminUserActivityRecord | undefined>;
}
