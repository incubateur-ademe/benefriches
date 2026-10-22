import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { AdminDashboardStats } from "../admin.types";
import { AdminAccessForbiddenError } from "../gateways/AdminGateway";

export const adminDashboardStatsRequested = createAppAsyncThunk<
  AdminDashboardStats,
  void,
  { rejectValue: "forbidden" | "error" }
>("admin/dashboardStatsRequested", async (_, { extra, rejectWithValue }) => {
  try {
    return await extra.adminService.getDashboardStats();
  } catch (error) {
    if (error instanceof AdminAccessForbiddenError) return rejectWithValue("forbidden");
    return rejectWithValue("error");
  }
});
