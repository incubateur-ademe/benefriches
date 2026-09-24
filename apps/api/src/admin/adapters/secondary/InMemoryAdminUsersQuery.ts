import type {
  AdminUserActivityRecord,
  AdminUserListItem,
  AdminUsersQuery,
} from "src/admin/core/gateways/AdminUsersQuery";

export class InMemoryAdminUsersQuery implements AdminUsersQuery {
  private activities = new Map<string, AdminUserActivityRecord>();

  _setUserActivities(activities: AdminUserActivityRecord[]): void {
    this.activities = new Map(activities.map((activity) => [activity.user.id, activity]));
  }

  list({
    search,
    page,
    pageSize,
  }: {
    search?: string;
    page: number;
    pageSize: number;
  }): Promise<{ users: AdminUserListItem[]; total: number }> {
    const normalizedSearch = search?.toLowerCase();
    const matching = Array.from(this.activities.values())
      .filter(({ user }) => {
        if (!normalizedSearch) return true;
        return [user.email, user.firstName, user.lastName, user.structureName].some((value) =>
          value?.toLowerCase().includes(normalizedSearch),
        );
      })
      .toSorted((a, b) => b.user.createdAt.getTime() - a.user.createdAt.getTime());

    const users = matching.slice((page - 1) * pageSize, page * pageSize).map((activity) => ({
      id: activity.user.id,
      email: activity.user.email,
      firstName: activity.user.firstName,
      lastName: activity.user.lastName,
      structureName: activity.user.structureName,
      structureType: activity.user.structureType,
      structureActivity: activity.user.structureActivity,
      createdAt: activity.user.createdAt,
      lastLoginAt: activity.loginDates.reduce<Date | null>(
        (latest, date) => (latest === null || date > latest ? date : latest),
        null,
      ),
    }));

    return Promise.resolve({ users, total: matching.length });
  }

  getUserActivity(userId: string): Promise<AdminUserActivityRecord | undefined> {
    return Promise.resolve(this.activities.get(userId));
  }
}
