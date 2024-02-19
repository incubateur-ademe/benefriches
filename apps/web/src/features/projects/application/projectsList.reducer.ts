import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ReconversionProjectsGroupedBySite } from "../domain/projects.types";
import { fetchReconversionProjects } from "./projectsList.actions";

import { RootState } from "@/app/application/store";

export type LoadingState = "idle" | "loading" | "success" | "error";

export type State = {
  reconversionProjectsLoadingState: LoadingState;
  reconversionProjects: ReconversionProjectsGroupedBySite;
};

const initialState: State = {
  reconversionProjectsLoadingState: "idle",
  reconversionProjects: [],
};

export const reconversionProjectsList = createSlice({
  name: "reconversionProjectsList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReconversionProjects.pending, (state) => {
      state.reconversionProjectsLoadingState = "loading";
    });
    builder.addCase(fetchReconversionProjects.fulfilled, (state, action) => {
      state.reconversionProjectsLoadingState = "success";
      state.reconversionProjects = action.payload;
    });
    builder.addCase(fetchReconversionProjects.rejected, (state) => {
      state.reconversionProjectsLoadingState = "error";
    });
  },
});

const selectSelf = (state: RootState) => state.reconversionProjectsList;

type ReconversionProjectWithSite = {
  id: string;
  name: string;
  site: {
    id: string;
    name: string;
  };
};
export const selectReconversionProjectById = createSelector(
  [selectSelf, (_state, projectId: string) => projectId],
  (state, projectId): ReconversionProjectWithSite | undefined => {
    const projectsGroup = state.reconversionProjects.find((group) =>
      group.reconversionProjects.find((project) => project.id === projectId),
    );
    const project = projectsGroup?.reconversionProjects.find((p) => p.id === projectId);

    if (!projectsGroup || !project) return undefined;

    return {
      id: project.id,
      name: project.name,
      site: {
        id: projectsGroup.siteId,
        name: projectsGroup.siteName,
      },
    };
  },
);

export const selectComparableProjects = createSelector(
  [selectSelf, selectReconversionProjectById],
  (state, project): ReconversionProjectsGroupedBySite[number]["reconversionProjects"] => {
    if (!project) return [];

    const projectGroup = state.reconversionProjects.find(
      (group) => group.siteId === project.site.id,
    );

    return projectGroup?.reconversionProjects.filter((p) => p.id !== project.id) ?? [];
  },
);

export default reconversionProjectsList.reducer;
