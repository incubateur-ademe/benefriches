import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryAdminService } from "../../infrastructure/admin-service/InMemoryAdminService";
import { adminDashboardStatsRequested } from "../actions/adminDashboardStatsRequested.action";
import { adminUserActivityRequested } from "../actions/adminUserActivityRequested.action";
import { adminUsersListRequested } from "../actions/adminUsersListRequested.action";
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
  lifecycleEmailMaxAttempts: 5,
};

const USER_B_ACTIVITY: AdminUserActivity = {
  ...USER_ACTIVITY,
  user: { ...USER_ACTIVITY.user, id: "user-2", email: "john@example.com" },
};

const JANE_LIST: AdminUsersList = {
  users: [USERS_LIST.users[0]!],
  total: 1,
  page: 1,
  pageSize: 25,
};

const JOHN_LIST: AdminUsersList = {
  users: [
    {
      id: "user-2",
      email: "john@example.com",
      firstName: "John",
      lastName: "Smith",
      structureName: "Aménageur SA",
      structureType: "company",
      structureActivity: "urban_planner",
      createdAt: "2026-02-10T10:00:00.000Z",
      lastLoginAt: null,
    },
  ],
  total: 1,
  page: 1,
  pageSize: 25,
};

const createTestStore = (options: ConstructorParameters<typeof InMemoryAdminService>[0] = {}) =>
  createStore(getTestAppDependencies({ adminService: new InMemoryAdminService(options) }));

describe("admin reducer", () => {
  describe("adminDashboardStatsRequested", () => {
    it("exposes the dashboard stats when fetch succeeds", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ dashboardStats: DASHBOARD_STATS }),
        }),
      );

      await store.dispatch(adminDashboardStatsRequested());

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

      await store.dispatch(adminDashboardStatsRequested());

      expect(selectAdminDashboardViewData(store.getState())).toEqual({
        loadingState: "error",
        stats: null,
      });
    });

    it("exposes a forbidden state when admin access is denied", async () => {
      const store = createTestStore({ shouldDenyAccess: true });

      await store.dispatch(adminDashboardStatsRequested());

      expect(selectAdminDashboardViewData(store.getState())).toEqual({
        loadingState: "forbidden",
        stats: null,
      });
    });
  });

  describe("adminUsersListRequested", () => {
    it("exposes the paginated users list with the requested search", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ usersList: USERS_LIST }),
        }),
      );

      await store.dispatch(adminUsersListRequested({ search: "jane", page: 2 }));

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

      await store.dispatch(adminUsersListRequested({ search: "jane", page: 2 }));

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

    it("exposes a forbidden state when admin access is denied", async () => {
      const store = createTestStore({ shouldDenyAccess: true });

      await store.dispatch(adminUsersListRequested({ search: "jane", page: 2 }));

      expect(selectAdminUsersViewData(store.getState())).toEqual({
        loadingState: "forbidden",
        users: [],
        total: 0,
        page: 2,
        pageSize: 25,
        pageCount: 1,
        search: "jane",
      });
    });

    it("shows the latest search when responses arrive in reverse order", () => {
      const store = createTestStore();

      store.dispatch(adminUsersListRequested.pending("req-jane", { search: "jane" }));
      store.dispatch(adminUsersListRequested.pending("req-john", { search: "john" }));
      store.dispatch(adminUsersListRequested.fulfilled(JOHN_LIST, "req-john", { search: "john" }));
      store.dispatch(adminUsersListRequested.fulfilled(JANE_LIST, "req-jane", { search: "jane" }));

      expect(selectAdminUsersViewData(store.getState())).toEqual({
        loadingState: "success",
        users: JOHN_LIST.users,
        total: 1,
        page: 1,
        pageSize: 25,
        pageCount: 1,
        search: "john",
      });
    });

    it("ignores a late failure of an earlier request", () => {
      const store = createTestStore();

      store.dispatch(adminUsersListRequested.pending("req-old", { page: 1 }));
      store.dispatch(adminUsersListRequested.pending("req-new", { page: 2 }));
      store.dispatch(adminUsersListRequested.fulfilled(USERS_LIST, "req-new", { page: 2 }));
      store.dispatch(
        adminUsersListRequested.rejected(new Error("x"), "req-old", { page: 1 }, "error"),
      );

      expect(selectAdminUsersViewData(store.getState())).toEqual({
        loadingState: "success",
        users: USERS_LIST.users,
        total: 51,
        page: 2,
        pageSize: 25,
        pageCount: 3,
        search: "",
      });
    });
  });

  describe("adminUserActivityRequested", () => {
    it("exposes the user activity when fetch succeeds", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ userActivities: { "user-1": USER_ACTIVITY } }),
        }),
      );

      await store.dispatch(adminUserActivityRequested("user-1"));

      expect(selectAdminUserViewData(store.getState(), "user-1")).toEqual({
        loadingState: "success",
        activity: USER_ACTIVITY,
      });
    });

    it("exposes a not_found state when the user does not exist", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ userActivities: {} }),
        }),
      );

      await store.dispatch(adminUserActivityRequested("unknown-user"));

      expect(selectAdminUserViewData(store.getState(), "unknown-user")).toEqual({
        loadingState: "not_found",
      });
    });

    it("exposes an error state when fetch fails", async () => {
      const store = createStore(
        getTestAppDependencies({
          adminService: new InMemoryAdminService({ shouldFail: true }),
        }),
      );

      await store.dispatch(adminUserActivityRequested("user-1"));

      expect(selectAdminUserViewData(store.getState(), "user-1")).toEqual({
        loadingState: "error",
      });
    });

    it("exposes a forbidden state when admin access is denied", async () => {
      const store = createTestStore({ shouldDenyAccess: true });

      await store.dispatch(adminUserActivityRequested("user-1"));

      expect(selectAdminUserViewData(store.getState(), "user-1")).toEqual({
        loadingState: "forbidden",
      });
    });

    it("exposes a loading state for a user not loaded yet", async () => {
      const store = createTestStore({ userActivities: { "user-1": USER_ACTIVITY } });
      await store.dispatch(adminUserActivityRequested("user-1"));

      expect(selectAdminUserViewData(store.getState(), "user-2")).toEqual({
        loadingState: "loading",
      });
    });

    it("leaves user B's state unchanged when a late response for user A arrives", () => {
      const store = createTestStore({
        userActivities: { "user-1": USER_ACTIVITY, "user-2": USER_B_ACTIVITY },
      });

      store.dispatch(adminUserActivityRequested.pending("req-a", "user-1"));
      store.dispatch(adminUserActivityRequested.pending("req-b", "user-2"));
      store.dispatch(adminUserActivityRequested.fulfilled(USER_ACTIVITY, "req-a", "user-1"));

      expect(selectAdminUserViewData(store.getState(), "user-2")).toEqual({
        loadingState: "loading",
      });
      expect(selectAdminUserViewData(store.getState(), "user-1")).toEqual({
        loadingState: "success",
        activity: USER_ACTIVITY,
      });
    });

    it("ignores a late failure of an earlier request for the same user", () => {
      const store = createTestStore();
      const latestActivity: AdminUserActivity = {
        ...USER_ACTIVITY,
        user: { ...USER_ACTIVITY.user, loginCount: 8 },
      };

      store.dispatch(adminUserActivityRequested.pending("req-a1", "user-1"));
      store.dispatch(adminUserActivityRequested.pending("req-b", "user-2"));
      store.dispatch(adminUserActivityRequested.pending("req-a2", "user-1"));
      store.dispatch(adminUserActivityRequested.fulfilled(latestActivity, "req-a2", "user-1"));
      store.dispatch(
        adminUserActivityRequested.rejected(new Error("x"), "req-a1", "user-1", "error"),
      );

      expect(selectAdminUserViewData(store.getState(), "user-1")).toEqual({
        loadingState: "success",
        activity: latestActivity,
      });
    });

    it("ignores a late success of an earlier request for the same user", () => {
      const store = createTestStore();

      store.dispatch(adminUserActivityRequested.pending("req-a1", "user-1"));
      store.dispatch(adminUserActivityRequested.pending("req-a2", "user-1"));
      store.dispatch(
        adminUserActivityRequested.rejected(new Error("x"), "req-a2", "user-1", "error"),
      );
      store.dispatch(adminUserActivityRequested.fulfilled(USER_ACTIVITY, "req-a1", "user-1"));

      expect(selectAdminUserViewData(store.getState(), "user-1")).toEqual({
        loadingState: "error",
      });
    });

    it("leaves user A's state unchanged when a request for user B completes", () => {
      const store = createTestStore();

      store.dispatch(adminUserActivityRequested.pending("req-a", "user-1"));
      store.dispatch(adminUserActivityRequested.fulfilled(USER_ACTIVITY, "req-a", "user-1"));
      store.dispatch(adminUserActivityRequested.pending("req-b", "user-2"));
      store.dispatch(
        adminUserActivityRequested.rejected(new Error("x"), "req-b", "user-2", "error"),
      );

      expect(selectAdminUserViewData(store.getState(), "user-1")).toEqual({
        loadingState: "success",
        activity: USER_ACTIVITY,
      });
    });
  });
});
