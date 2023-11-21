import { createSlice } from "@reduxjs/toolkit";
import { ProjectsBySite } from "../domain/projects.types";
import { fetchProjectsListBySite } from "./projectsList.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

export type State = {
  loadingState: LoadingState;
  projectsList: ProjectsBySite[];
};

const initialState: State = {
  loadingState: "idle",
  projectsList: [],
};

export const projectsList = createSlice({
  name: "projectsList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjectsListBySite.pending, (state) => {
      state.loadingState = "loading";
    });
    builder.addCase(fetchProjectsListBySite.fulfilled, (state, action) => {
      state.loadingState = "success";
      state.projectsList = action.payload;
    });
    builder.addCase(fetchProjectsListBySite.rejected, (state) => {
      state.loadingState = "error";
    });
  },
});

export default projectsList.reducer;
