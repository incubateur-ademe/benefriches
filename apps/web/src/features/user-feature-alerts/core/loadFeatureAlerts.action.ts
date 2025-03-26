import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { UserFeatureAlertsResult } from "./CreateFeatureAlertGateway";

export const loadFeatureAlerts = createAppAsyncThunk<UserFeatureAlertsResult>(
  "user/loadFeatureAlerts",
  (_, { extra }) => {
    return extra.createUserFeatureAlertService.getPersistedFeatureAlerts();
  },
);
