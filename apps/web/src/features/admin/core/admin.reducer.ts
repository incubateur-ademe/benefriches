import { createReducer } from "@reduxjs/toolkit";

import { fetchAdminDashboardStats } from "./actions/fetchAdminDashboardStats.action";
import { fetchAdminUserActivity } from "./actions/fetchAdminUserActivity.action";
import { fetchAdminUsers } from "./actions/fetchAdminUsers.action";
import type {
  AdminDashboardStats,
  AdminUserActivity,
  AdminUserSummary,
  LoadingState,
} from "./admin.types";

export type AdminState = {
  dashboard: {
    loadingState: LoadingState;
    stats: AdminDashboardStats | null;
  };
  usersList: {
    loadingState: LoadingState;
    users: AdminUserSummary[];
    total: number;
    page: number;
    pageSize: number;
    search: string;
  };
  selectedUser: {
    loadingState: LoadingState | "not_found";
    userId: string | null;
    activity: AdminUserActivity | null;
  };
};

export const initialState: AdminState = {
  dashboard: { loadingState: "idle", stats: null },
  usersList: { loadingState: "idle", users: [], total: 0, page: 1, pageSize: 25, search: "" },
  selectedUser: { loadingState: "idle", userId: null, activity: null },
};

export const adminReducer = createReducer(initialState, (builder) => {
  builder.addCase(fetchAdminDashboardStats.pending, (state) => {
    state.dashboard.loadingState = "loading";
  });
  builder.addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
    state.dashboard.loadingState = "success";
    state.dashboard.stats = action.payload;
  });
  builder.addCase(fetchAdminDashboardStats.rejected, (state) => {
    state.dashboard.loadingState = "error";
    state.dashboard.stats = null;
  });

  builder.addCase(fetchAdminUsers.pending, (state, action) => {
    state.usersList.loadingState = "loading";
    state.usersList.search = action.meta.arg.search ?? "";
    state.usersList.page = action.meta.arg.page ?? 1;
  });
  builder.addCase(fetchAdminUsers.fulfilled, (state, action) => {
    state.usersList.loadingState = "success";
    state.usersList.users = action.payload.users;
    state.usersList.total = action.payload.total;
    state.usersList.page = action.payload.page;
    state.usersList.pageSize = action.payload.pageSize;
  });
  builder.addCase(fetchAdminUsers.rejected, (state) => {
    state.usersList.loadingState = "error";
    state.usersList.users = [];
    state.usersList.total = 0;
  });

  builder.addCase(fetchAdminUserActivity.pending, (state, action) => {
    state.selectedUser.loadingState = "loading";
    state.selectedUser.userId = action.meta.arg;
    state.selectedUser.activity = null;
  });
  builder.addCase(fetchAdminUserActivity.fulfilled, (state, action) => {
    state.selectedUser.loadingState = "success";
    state.selectedUser.activity = action.payload;
  });
  builder.addCase(fetchAdminUserActivity.rejected, (state, action) => {
    state.selectedUser.loadingState = action.payload === "not_found" ? "not_found" : "error";
    state.selectedUser.activity = null;
  });
});

export default adminReducer;
