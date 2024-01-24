import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ProjectsGroupedBySite, ProjectsList, SitesList } from "../domain/projects.types";
import { fetchProjects, fetchSites } from "./projectsList.actions";

import { RootState } from "@/app/application/store";

export type LoadingState = "idle" | "loading" | "success" | "error";

export type State = {
  projectsLoadingState: LoadingState;
  projects: ProjectsList;
  sitesLoadingState: LoadingState;
  sites: SitesList;
};

const initialState: State = {
  projectsLoadingState: "idle",
  projects: [],
  sitesLoadingState: "idle",
  sites: [],
};

export const projectsList = createSlice({
  name: "projectsList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.projectsLoadingState = "loading";
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.projectsLoadingState = "success";
      state.projects = action.payload;
    });
    builder.addCase(fetchProjects.rejected, (state) => {
      state.projectsLoadingState = "error";
    });

    builder.addCase(fetchSites.pending, (state) => {
      state.sitesLoadingState = "loading";
    });
    builder.addCase(fetchSites.fulfilled, (state, action) => {
      state.sitesLoadingState = "success";
      state.sites = action.payload;
    });
    builder.addCase(fetchSites.rejected, (state) => {
      state.sitesLoadingState = "error";
    });
  },
});

const selectSelf = (state: RootState) => state.projectsList;

export const selectProjectById = createSelector(
  [selectSelf, (_state, projectId: string) => projectId],
  (state, projectId): ProjectsList[number] | undefined => {
    return state.projects.find((project) => project.id === projectId);
  },
);

export const selectProjects = createSelector([selectSelf], (state): ProjectsList => {
  return state.projects;
});

export const selectProjectsGroupedBySite = createSelector(
  [selectSelf],
  (state): ProjectsGroupedBySite => {
    return state.sites.map((site) => {
      return {
        siteId: site.id,
        siteName: site.name,
        projects: state.projects.filter((project) => project.site.id === site.id),
      };
    });
  },
);

export const selectSitesAndProjectsLoadingState = createSelector(
  [selectSelf],
  (state): LoadingState => {
    const { projectsLoadingState, sitesLoadingState } = state;

    if (projectsLoadingState === "error" || sitesLoadingState === "error") return "error";

    if (projectsLoadingState === "loading" || sitesLoadingState === "loading") return "loading";

    if (projectsLoadingState === "success" && sitesLoadingState === "success") return "success";

    return "idle";
  },
);

export default projectsList.reducer;
