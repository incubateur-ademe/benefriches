import {
  createProjectFormActions,
  makeUrbanProjectFormActionType,
} from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";
import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import {
  makeProjectCreationActionType,
  PROJECT_CREATION_ACTION_PREFIX,
} from "../actions/actionsUtils";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "../actions/soilsCarbonStorage.action";
import { selectSiteAddress, selectSiteSoilsDistribution } from "../createProject.selectors";
import { selectProjectSoilDistribution } from "./urbanProject.selectors";

const {
  requestStepCompletion,
  cancelStepCompletion,
  confirmStepCompletion,
  navigateToNext,
  navigateToPrevious,
  navigateToStep,
} = createProjectFormActions(PROJECT_CREATION_ACTION_PREFIX);

export {
  requestStepCompletion,
  cancelStepCompletion,
  confirmStepCompletion,
  navigateToNext,
  navigateToPrevious,
  navigateToStep,
};

export const fetchSoilsCarbonStorageDifference =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    makeUrbanProjectFormActionType(
      PROJECT_CREATION_ACTION_PREFIX,
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

export const makeUrbanProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`urbanProject/${actionName}`);
};
