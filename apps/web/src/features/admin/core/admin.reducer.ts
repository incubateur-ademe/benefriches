import { createReducer } from "@reduxjs/toolkit";

import { adminDashboardStatsRequested } from "./actions/adminDashboardStatsRequested.action";
import { adminUserActivityRequested } from "./actions/adminUserActivityRequested.action";
import { adminUsersListRequested } from "./actions/adminUsersListRequested.action";
import type {
  AdminDashboardStats,
  AdminLoadingState,
  AdminUserActivity,
  AdminUserSummary,
} from "./admin.types";

export type AdminUserEntry =
  | { loadingState: "loading" }
  | { loadingState: "success"; activity: AdminUserActivity }
  | { loadingState: "not_found" | "forbidden" | "error" };

export type AdminState = {
  dashboard: {
    loadingState: AdminLoadingState;
    stats: AdminDashboardStats | null;
  };
  usersList: {
    loadingState: AdminLoadingState;
    latestRequestId: string | null;
    users: AdminUserSummary[];
    total: number;
    page: number;
    pageSize: number;
    search: string;
  };
  usersById: Record<string, AdminUserEntry>;
};

export const initialState: AdminState = {
  dashboard: { loadingState: "idle", stats: null },
  usersList: {
    loadingState: "idle",
    latestRequestId: null,
    users: [],
    total: 0,
    page: 1,
    pageSize: 25,
    search: "",
  },
  usersById: {},
};

export const adminReducer = createReducer(initialState, (builder) => {
  builder.addCase(adminDashboardStatsRequested.pending, (state) => {
    state.dashboard.loadingState = "loading";
  });
  builder.addCase(adminDashboardStatsRequested.fulfilled, (state, action) => {
    state.dashboard.loadingState = "success";
    state.dashboard.stats = action.payload;
  });
  builder.addCase(adminDashboardStatsRequested.rejected, (state, action) => {
    state.dashboard.loadingState = action.payload ?? "error";
    state.dashboard.stats = null;
  });

  builder.addCase(adminUsersListRequested.pending, (state, action) => {
    state.usersList.loadingState = "loading";
    state.usersList.latestRequestId = action.meta.requestId;
    state.usersList.search = action.meta.arg.search ?? "";
    state.usersList.page = action.meta.arg.page ?? 1;
  });
  builder.addCase(adminUsersListRequested.fulfilled, (state, action) => {
    if (action.meta.requestId !== state.usersList.latestRequestId) return;
    state.usersList.loadingState = "success";
    state.usersList.users = action.payload.users;
    state.usersList.total = action.payload.total;
    state.usersList.page = action.payload.page;
    state.usersList.pageSize = action.payload.pageSize;
  });
  builder.addCase(adminUsersListRequested.rejected, (state, action) => {
    if (action.meta.requestId !== state.usersList.latestRequestId) return;
    state.usersList.loadingState = action.payload ?? "error";
    state.usersList.users = [];
    state.usersList.total = 0;
  });

  builder.addCase(adminUserActivityRequested.pending, (state, action) => {
    state.usersById[action.meta.arg] = { loadingState: "loading" };
  });
  builder.addCase(adminUserActivityRequested.fulfilled, (state, action) => {
    state.usersById[action.meta.arg] = { loadingState: "success", activity: action.payload };
  });
  builder.addCase(adminUserActivityRequested.rejected, (state, action) => {
    state.usersById[action.meta.arg] = { loadingState: action.payload ?? "error" };
  });
});

export default adminReducer;
