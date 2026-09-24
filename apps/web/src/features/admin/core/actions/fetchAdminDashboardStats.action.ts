import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { AdminDashboardStats } from "../admin.types";

export const fetchAdminDashboardStats = createAppAsyncThunk<AdminDashboardStats>(
  "admin/dashboardStatsFetched",
  async (_, { extra }) => {
    return extra.adminService.getDashboardStats();
  },
);
