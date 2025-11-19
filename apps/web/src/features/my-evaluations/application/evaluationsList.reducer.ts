import { createSlice } from "@reduxjs/toolkit";

import { UserSiteEvaluation } from "../domain/types";
import { fetchUserSiteEvaluations } from "./evaluationsList.actions";

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
  },
});

export default userSiteEvaluationsList.reducer;
