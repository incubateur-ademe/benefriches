import { ProjectSite } from "@/features/create-project/core/project.types";
import { createFetchLocalAuthoritiesThunk } from "@/shared/core/reducers/project-form/getSiteLocalAuthorities.action";
import { createProjectFormActions } from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";
import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { RootState } from "@/shared/core/store-config/store";

import {
  selectProjectSoilsDistribution,
  selectSiteAddress,
  selectSiteSoilsDistribution,
} from "./updateProject.selectors";

const UPDATE_PROJECT_ACTION_PREFIX = "projectUpdate";

export const makeProjectUpdateActionType = (actionName: string) => {
  return `${UPDATE_PROJECT_ACTION_PREFIX}/${actionName}`;
};

export const updateProjectFormActions = createProjectFormActions(UPDATE_PROJECT_ACTION_PREFIX, {
  selectProjectSoilsDistribution,
  selectSiteAddress,
  selectSiteSoilsDistribution,
});

export const fetchSiteLocalAuthorities = createFetchLocalAuthoritiesThunk<RootState>({
  entityName: UPDATE_PROJECT_ACTION_PREFIX,
  selectSiteData: (state) => state.projectCreation.siteData,
  selectSiteLocalAuthorities: (state) => state.projectCreation.siteRelatedLocalAuthorities,
});

export const reconversionProjectUpdateInitiated = createAppAsyncThunk<
  ProjectSite,
  { relatedSiteId: string }
>(makeProjectUpdateActionType("init"), async ({ relatedSiteId }, { extra }) => {
  const projectSite = await extra.getSiteByIdService.getById(relatedSiteId);

  if (!projectSite) throw new Error("Site not found");

  return projectSite;
});
