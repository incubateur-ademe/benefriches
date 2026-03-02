import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { UserFeatureAlertsResult } from "./CreateFeatureAlertGateway";

export const loadFeatureAlerts = createAppAsyncThunk<UserFeatureAlertsResult>(
  "user/loadFeatureAlerts",
  (_, { extra }) => {
    return extra.createUserFeatureAlertService.getPersistedFeatureAlerts();
  },
);
