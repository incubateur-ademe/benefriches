import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { AdminUsersList } from "../admin.types";
import { AdminAccessForbiddenError, type ListAdminUsersParams } from "../gateways/AdminGateway";

export const adminUsersListRequested = createAppAsyncThunk<
  AdminUsersList,
  ListAdminUsersParams,
  { rejectValue: "forbidden" | "error" }
>("admin/usersListRequested", async (params, { extra, rejectWithValue }) => {
  try {
    return await extra.adminService.listUsers(params);
  } catch (error) {
    if (error instanceof AdminAccessForbiddenError) return rejectWithValue("forbidden");
    return rejectWithValue("error");
  }
});
