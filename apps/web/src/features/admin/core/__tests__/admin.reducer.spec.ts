import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryAdminService } from "../../infrastructure/admin-service/InMemoryAdminService";
import { fetchAdminDashboardStats } from "../actions/fetchAdminDashboardStats.action";
import { fetchAdminUserActivity } from "../actions/fetchAdminUserActivity.action";
import { fetchAdminUsers } from "../actions/fetchAdminUsers.action";
import {
  selectAdminDashboardViewData,
  selectAdminUsersViewData,
  selectAdminUserViewData,
} from "../admin.selectors";
import type { AdminDashboardStats, AdminUserActivity, AdminUsersList } from "../admin.types";

const DASHBOARD_STATS: AdminDashboardStats = {
  totals: { users: 120, sites: 80, projects: 45, compatibilityEvaluations: 30 },
  currentMonth: {
    month: "2026-09",
    usersCreated: 12,
    sitesCreated: 8,
    projectsCreated: 5,
    compatibilityEvaluationsCreated: 3,
    logins: 40,
  },
  monthly: [
    {
      month: "2026-08",
      usersCreated: 10,
      sitesCreated: 6,
      projectsCreated: 4,
      compatibilityEvaluationsCreated: 2,
      logins: 35,
    },
  ],
};

const USERS_LIST: AdminUsersList = {
  users: [
    {
      id: "user-1",
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Doe",
      structureName: "Mairie de Lyon",
      structureType: "local_authority",
      structureActivity: "municipality",
      createdAt: "2026-01-10T10:00:00.000Z",
      lastLoginAt: "2026-09-01T08:30:00.000Z",
    },
  ],
  total: 51,
  page: 2,
  pageSize: 25,
};

const USER_ACTIVITY: AdminUserActivity = {
  user: {
    id: "user-1",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    structureName: "Mairie de Lyon",
    structureType: "local_authority",
    structureActivity: "municipality",
    createdAt: "2026-01-10T10:00:00.000Z",
    lastLoginAt: "2026-09-01T08:30:00.000Z",
    loginCount: 7,
    subscribedToNewsletter: true,
  },
  timeline: [
    {
      date: "2026-01-10T10:00:00.000Z",
      type: "account_created",
      entityId: null,
      entityName: null,
      emailType: null,
      deliveryStatus: null,
      deliveryAttempts: null,
      deliveryMaxAttempts: null,
      deliveryErrorMessage: null,
    },
    {
      date: "2026-02-01T09:00:00.000Z",
      type: "site_created",
      entityId: "site-1",
      entityName: "Friche",
      emailType: null,
      deliveryStatus: null,
      deliveryAttempts: null,
      deliveryMaxAttempts: null,
      deliveryErrorMessage: null,
    },
  ],
  sites: [
    {
      id: "site-1",
      name: "Friche",
      nature: "FRICHE",
      creationMode: "custom",
      status: "active",
      createdAt: "2026-02-01T09:00:00.000Z",
      updatedAt: null,
    },
  ],
  projects: [],
  compatibilityEvaluations: [],
};

describe("admin reducer", () => {
  describe("fetchAdminDashboardStats", () => {
    it("exposes the dashboard stats when fetch succeeds", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ dashboardStats: DASHBOARD_STATS }),
        }),
      );

      await store.dispatch(fetchAdminDashboardStats());

      expect(selectAdminDashboardViewData(store.getState())).toEqual({
        loadingState: "success",
        stats: DASHBOARD_STATS,
      });
    });

    it("exposes an error state when fetch fails", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ shouldFail: true }),
        }),
      );

      await store.dispatch(fetchAdminDashboardStats());

      expect(selectAdminDashboardViewData(store.getState())).toEqual({
        loadingState: "error",
        stats: null,
      });
    });
  });

  describe("fetchAdminUsers", () => {
    it("exposes the paginated users list with the requested search", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ usersList: USERS_LIST }),
        }),
      );

      await store.dispatch(fetchAdminUsers({ search: "jane", page: 2 }));

      expect(selectAdminUsersViewData(store.getState())).toEqual({
        loadingState: "success",
        users: USERS_LIST.users,
        total: 51,
        page: 2,
        pageSize: 25,
        pageCount: 3,
        search: "jane",
      });
    });

    it("exposes an empty error state when fetch fails", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ shouldFail: true }),
        }),
      );

      await store.dispatch(fetchAdminUsers({ search: "jane", page: 2 }));

      expect(selectAdminUsersViewData(store.getState())).toEqual({
        loadingState: "error",
        users: [],
        total: 0,
        page: 2,
        pageSize: 25,
        pageCount: 1,
        search: "jane",
      });
    });
  });

  describe("fetchAdminUserActivity", () => {
    it("exposes the user activity when fetch succeeds", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ userActivities: { "user-1": USER_ACTIVITY } }),
        }),
      );

      await store.dispatch(fetchAdminUserActivity("user-1"));

      expect(selectAdminUserViewData(store.getState())).toEqual({
        loadingState: "success",
        userId: "user-1",
        activity: USER_ACTIVITY,
      });
    });

    it("exposes a not_found state when the user does not exist", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ userActivities: {} }),
        }),
      );

      await store.dispatch(fetchAdminUserActivity("unknown-user"));

      expect(selectAdminUserViewData(store.getState())).toEqual({
        loadingState: "not_found",
        userId: "unknown-user",
        activity: null,
      });
    });

    it("exposes an error state when fetch fails", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ shouldFail: true }),
        }),
      );

      await store.dispatch(fetchAdminUserActivity("user-1"));

      expect(selectAdminUserViewData(store.getState())).toEqual({
        loadingState: "error",
        userId: "user-1",
        activity: null,
      });
    });
  });
});
