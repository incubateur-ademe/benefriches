import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { AdminUserActivity } from "../admin.types";
import { AdminAccessForbiddenError, AdminUserNotFoundError } from "../gateways/AdminGateway";

export const adminUserActivityRequested = createAppAsyncThunk<
  AdminUserActivity,
  string,
  { rejectValue: "forbidden" | "not_found" | "error" }
>("admin/userActivityRequested", async (userId, { extra, rejectWithValue }) => {
  try {
    return await extra.adminService.getUserActivity(userId);
  } catch (error) {
    if (error instanceof AdminAccessForbiddenError) return rejectWithValue("forbidden");
    if (error instanceof AdminUserNotFoundError) return rejectWithValue("not_found");
    return rejectWithValue("error");
  }
});
