import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { AdminUsersList } from "../admin.types";
import type { ListAdminUsersParams } from "../gateways/AdminGateway";

export const fetchAdminUsers = createAppAsyncThunk<AdminUsersList, ListAdminUsersParams>(
  "admin/usersFetched",
  async (params, { extra }) => {
    return extra.adminService.listUsers(params);
  },
);
