import { v4 as uuid } from "uuid";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { UserFeatureAlert } from "./userFeatureAlert";

export const featureAlertSubscribed = createAppAsyncThunk<
  UserFeatureAlert,
  Omit<UserFeatureAlert, "id" | "userId">
>("user/featureAlertSubscribed", async (featureAlertProps, { extra, getState }) => {
  const featureAlert = {
    ...featureAlertProps,
    id: uuid(),
    userId: getState().currentUser.currentUser?.id ?? undefined,
  };

  await extra.createUserFeatureAlertService.save(featureAlert);
  extra.createUserFeatureAlertService.persistNewFeatureAlert(featureAlert.feature);

  return featureAlert;
});
