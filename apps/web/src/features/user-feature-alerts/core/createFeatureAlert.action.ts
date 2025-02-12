import { v4 as uuid } from "uuid";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { UserFeatureAlert } from "./userFeatureAlert";

export const createFeatureAlert = createAppAsyncThunk<
  UserFeatureAlert,
  Omit<UserFeatureAlert, "id" | "userId">
>("user/createFeatureAlert", async (createUserProps, { extra, getState }) => {
  const featureAlert = {
    ...createUserProps,
    id: uuid(),
    userId: getState().currentUser.currentUser?.id ?? "",
  };

  await extra.createUserFeatureAlertService.save(featureAlert);
  extra.createUserFeatureAlertService.persistNewFeatureAlert(featureAlert.feature.type);

  return featureAlert;
});
