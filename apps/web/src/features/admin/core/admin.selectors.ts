import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import type { AdminState, AdminUserLoad } from "./admin.reducer";
import type { AdminDashboardStats, AdminLoadingState, AdminUserSummary } from "./admin.types";

const selectAdmin = (state: RootState): AdminState => state.admin;

export type AdminDashboardViewData = {
  loadingState: AdminLoadingState;
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
  loadingState: AdminLoadingState;
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

export type AdminUserViewData = AdminUserLoad;

const USER_NOT_LOADED_YET: AdminUserViewData = { loadingState: "loading" };

export const selectAdminUserViewData = createSelector(
  [selectAdmin, (_state: RootState, userId: string) => userId],
  (admin, userId): AdminUserViewData => {
    const entry = admin.usersById[userId];
    if (!entry) return USER_NOT_LOADED_YET;
    const { latestRequestId: _latestRequestId, ...viewData } = entry;
    return viewData;
  },
);
