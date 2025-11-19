import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { UserSiteEvaluation } from "../domain/types";

export interface SiteEvaluationGateway {
  getUserList(): Promise<UserSiteEvaluation[]>;
}

export const fetchUserSiteEvaluations = createAppAsyncThunk<UserSiteEvaluation[]>(
  "siteEvaluations/fetchList",
  async (_, { extra }) => {
    const result = await extra.siteEvaluationService.getUserList();
    return result;
  },
);
