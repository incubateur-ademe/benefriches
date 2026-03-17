import { createAction } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

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

export const projectRemovedFromEvaluationList = createAction<{ siteId: string; projectId: string }>(
  `siteEvaluations/projectRemoved`,
);

export const siteRemovedFromEvaluationList = createAction<string>(`siteEvaluations/siteRemoved`);
