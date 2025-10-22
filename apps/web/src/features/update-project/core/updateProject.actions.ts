import { ProjectSite } from "@/features/create-project/core/project.types";
import { createFetchLocalAuthoritiesThunk } from "@/shared/core/reducers/project-form/getSiteLocalAuthorities.action";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/shared/core/reducers/project-form/soilsCarbonStorage.action";
import {
  createProjectFormActions,
  makeUrbanProjectFormActionType,
} from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";
import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { RootState } from "@/shared/core/store-config/store";

import {
  selectProjectSoilDistribution,
  selectSiteAddress,
  selectSiteSoilsDistribution,
} from "./updateProject.selectors";

const UPDATE_PROJECT_ACTION_PREFIX = "updateProject";

export const makeProjectUpdateActionType = (actionName: string) => {
  return `${UPDATE_PROJECT_ACTION_PREFIX}/${actionName}`;
};

const {
  requestStepCompletion,
  cancelStepCompletion,
  confirmStepCompletion,
  navigateToNext,
  navigateToPrevious,
  navigateToStep,
} = createProjectFormActions(UPDATE_PROJECT_ACTION_PREFIX);

export {
  requestStepCompletion,
  cancelStepCompletion,
  confirmStepCompletion,
  navigateToNext,
  navigateToPrevious,
  navigateToStep,
};

export const fetchSiteLocalAuthorities = createFetchLocalAuthoritiesThunk<RootState>({
  entityName: UPDATE_PROJECT_ACTION_PREFIX,
  selectSiteData: (state) => state.projectCreation.siteData,
  selectSiteLocalAuthorities: (state) => state.projectCreation.siteRelatedLocalAuthorities,
});

export const fetchSoilsCarbonStorageDifference =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    makeUrbanProjectFormActionType(
      UPDATE_PROJECT_ACTION_PREFIX,
      "fetchCurrentAndProjectedSoilsCarbonStorage",
    ),
    async (_, { extra, getState }) => {
      const rootState = getState();
      const siteAddress = selectSiteAddress(rootState);
      const siteSoils = selectSiteSoilsDistribution(rootState);
      const projectSoils = selectProjectSoilDistribution(rootState);

      if (!siteAddress) throw new Error("Missing site address");

      const [current, projected] = await Promise.all([
        extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          cityCode: siteAddress.cityCode,
          soils: siteSoils,
        }),
        extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          soils: projectSoils,
          cityCode: siteAddress.cityCode,
        }),
      ]);

      return {
        current,
        projected,
      };
    },
  );

export const reconversionProjectUpdateInitiated = createAppAsyncThunk<
  ProjectSite,
  { relatedSiteId: string }
>(makeProjectUpdateActionType("init"), async ({ relatedSiteId }, { extra }) => {
  const projectSite = await extra.getSiteByIdService.getById(relatedSiteId);

  if (!projectSite) throw new Error("Site not found");

  return projectSite;
});
