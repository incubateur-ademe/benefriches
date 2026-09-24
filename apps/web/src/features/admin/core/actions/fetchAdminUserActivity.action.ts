import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { AdminUserActivity } from "../admin.types";
import { AdminUserNotFoundError } from "../gateways/AdminGateway";

export const fetchAdminUserActivity = createAppAsyncThunk<
  AdminUserActivity,
  string,
  { rejectValue: "not_found" | "error" }
>("admin/userActivityFetched", async (userId, { extra, rejectWithValue }) => {
  try {
    return await extra.adminService.getUserActivity(userId);
  } catch (error) {
    if (error instanceof AdminUserNotFoundError) return rejectWithValue("not_found");
    return rejectWithValue("error");
  }
});
