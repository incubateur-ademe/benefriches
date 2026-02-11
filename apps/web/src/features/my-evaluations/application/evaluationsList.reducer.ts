import { createSlice } from "@reduxjs/toolkit";

import { UserSiteEvaluation } from "../domain/types";
import {
  fetchUserSiteEvaluations,
  projectRemovedFromEvaluationList,
} from "./evaluationsList.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

type State = {
  loadingState: LoadingState;
  siteEvaluations: UserSiteEvaluation[];
};

const initialState: State = {
  loadingState: "idle",
  siteEvaluations: [],
};

const userSiteEvaluationsList = createSlice({
  name: "userSiteEvaluationsList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserSiteEvaluations.pending, (state) => {
      state.loadingState = "loading";
    });
    builder.addCase(fetchUserSiteEvaluations.fulfilled, (state, action) => {
      state.loadingState = "success";
      state.siteEvaluations = action.payload;
    });
    builder.addCase(fetchUserSiteEvaluations.rejected, (state) => {
      state.loadingState = "error";
    });
    builder.addCase(projectRemovedFromEvaluationList, (state, action) => {
      const index = state.siteEvaluations.findIndex(
        (siteEval) => siteEval.siteId === action.payload.siteId,
      );
      if (state.siteEvaluations[index]) {
        state.siteEvaluations[index].reconversionProjects.lastProjects = state.siteEvaluations[
          index
        ].reconversionProjects.lastProjects.filter(({ id }) => id !== action.payload.projectId);
        state.siteEvaluations[index].reconversionProjects.total -= 1;
      }
    });
  },
});

export default userSiteEvaluationsList.reducer;
