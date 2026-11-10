import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { AdminImpactsExportersList } from "../admin.types";
import {
  AdminAccessForbiddenError,
  type ListAdminImpactsExportersParams,
} from "../gateways/AdminGateway";

export const adminImpactsExportersListRequested = createAppAsyncThunk<
  AdminImpactsExportersList,
  ListAdminImpactsExportersParams,
  { rejectValue: "forbidden" | "error" }
>("admin/impactsExportersListRequested", async (params, { extra, rejectWithValue }) => {
  try {
    return await extra.adminService.listImpactsExporters(params);
  } catch (error) {
    if (error instanceof AdminAccessForbiddenError) return rejectWithValue("forbidden");
    return rejectWithValue("error");
  }
});
