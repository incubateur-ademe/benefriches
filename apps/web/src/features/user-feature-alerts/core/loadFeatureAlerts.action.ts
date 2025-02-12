import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { UserFeatureAlert } from "./userFeatureAlert";

export const loadFeatureAlerts = createAppAsyncThunk<UserFeatureAlert["feature"]["type"][]>(
  "user/loadFeatureAlerts",
  (_, { extra }) => {
    return extra.createUserFeatureAlertService.getList();
  },
);
