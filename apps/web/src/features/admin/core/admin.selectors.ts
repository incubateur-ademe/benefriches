import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import type { AdminState } from "./admin.reducer";
import type {
  AdminDashboardStats,
  AdminUserActivity,
  AdminUserSummary,
  LoadingState,
} from "./admin.types";

const selectAdmin = (state: RootState): AdminState => state.admin;

export type AdminDashboardViewData = {
  loadingState: LoadingState;
  stats: AdminDashboardStats | null;
};

export const selectAdminDashboardViewData = createSelector(
  [selectAdmin],
  (admin): AdminDashboardViewData => ({
    loadingState: admin.dashboard.loadingState,
    stats: admin.dashboard.stats,
  }),
);

export type AdminUsersViewData = {
  loadingState: LoadingState;
  users: AdminUserSummary[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  search: string;
};

export const selectAdminUsersViewData = createSelector(
  [selectAdmin],
  (admin): AdminUsersViewData => ({
    loadingState: admin.usersList.loadingState,
    users: admin.usersList.users,
    total: admin.usersList.total,
    page: admin.usersList.page,
    pageSize: admin.usersList.pageSize,
    pageCount: Math.max(1, Math.ceil(admin.usersList.total / admin.usersList.pageSize)),
    search: admin.usersList.search,
  }),
);

export type AdminUserViewData = {
  loadingState: LoadingState | "not_found";
  userId: string | null;
  activity: AdminUserActivity | null;
};

export const selectAdminUserViewData = createSelector(
  [selectAdmin],
  (admin): AdminUserViewData => ({
    loadingState: admin.selectedUser.loadingState,
    userId: admin.selectedUser.userId,
    activity: admin.selectedUser.activity,
  }),
);
