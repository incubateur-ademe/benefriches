import { createReducer } from "@reduxjs/toolkit";

import { adminDashboardStatsRequested } from "./actions/adminDashboardStatsRequested.action";
import { adminImpactsExportersListRequested } from "./actions/adminImpactsExportersListRequested.action";
import { adminUserActivityRequested } from "./actions/adminUserActivityRequested.action";
import { adminUsersListRequested } from "./actions/adminUsersListRequested.action";
import type {
  AdminDashboardStats,
  AdminImpactsExporter,
  AdminLoadingState,
  AdminUserActivity,
  AdminUserSummary,
} from "./admin.types";

export type AdminUserLoad =
  | { loadingState: "loading" }
  | { loadingState: "success"; activity: AdminUserActivity }
  | { loadingState: "not_found" | "forbidden" | "error" };

export type AdminUserEntry = AdminUserLoad & { latestRequestId: string };

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
  impactsExportersList: {
    loadingState: AdminLoadingState;
    latestRequestId: string | null;
    users: AdminImpactsExporter[];
    total: number;
    page: number;
    pageSize: number;
    search: string;
  };
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
  impactsExportersList: {
    loadingState: "idle",
    latestRequestId: null,
    users: [],
    total: 0,
    page: 1,
    pageSize: 25,
    search: "",
  },
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
    state.usersById[action.meta.arg] = {
      loadingState: "loading",
      latestRequestId: action.meta.requestId,
    };
  });
  builder.addCase(adminUserActivityRequested.fulfilled, (state, action) => {
    const { arg: userId, requestId } = action.meta;
    if (requestId !== state.usersById[userId]?.latestRequestId) return;
    state.usersById[userId] = {
      loadingState: "success",
      activity: action.payload,
      latestRequestId: requestId,
    };
  });
  builder.addCase(adminUserActivityRequested.rejected, (state, action) => {
    const { arg: userId, requestId } = action.meta;
    if (requestId !== state.usersById[userId]?.latestRequestId) return;
    state.usersById[userId] = {
      loadingState: action.payload ?? "error",
      latestRequestId: requestId,
    };
  });

  builder.addCase(adminImpactsExportersListRequested.pending, (state, action) => {
    state.impactsExportersList.loadingState = "loading";
    state.impactsExportersList.latestRequestId = action.meta.requestId;
    state.impactsExportersList.search = action.meta.arg.search ?? "";
    state.impactsExportersList.page = action.meta.arg.page ?? 1;
  });
  builder.addCase(adminImpactsExportersListRequested.fulfilled, (state, action) => {
    if (action.meta.requestId !== state.impactsExportersList.latestRequestId) return;
    state.impactsExportersList.loadingState = "success";
    state.impactsExportersList.users = action.payload.users;
    state.impactsExportersList.total = action.payload.total;
    state.impactsExportersList.page = action.payload.page;
    state.impactsExportersList.pageSize = action.payload.pageSize;
  });
  builder.addCase(adminImpactsExportersListRequested.rejected, (state, action) => {
    if (action.meta.requestId !== state.impactsExportersList.latestRequestId) return;
    state.impactsExportersList.loadingState = action.payload ?? "error";
    state.impactsExportersList.users = [];
    state.impactsExportersList.total = 0;
  });
});

export default adminReducer;
