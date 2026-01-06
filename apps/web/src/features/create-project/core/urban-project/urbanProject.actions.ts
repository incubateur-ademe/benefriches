import { createProjectFormActions } from "@/shared/core/reducers/project-form/projectForm.actions";
import { createUrbanProjectFormActions } from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";

import {
  makeProjectCreationActionType,
  PROJECT_CREATION_ACTION_PREFIX,
} from "../actions/actionsUtils";
import { selectSiteAddress, selectSiteSoilsDistribution } from "../createProject.selectors";
import { selectProjectSoilsDistributionByType } from "./urbanProject.selectors";

export const creationProjectFormActions = createProjectFormActions(PROJECT_CREATION_ACTION_PREFIX);
export const creationProjectFormUrbanActions = createUrbanProjectFormActions(
  PROJECT_CREATION_ACTION_PREFIX,
  {
    selectProjectSoilsDistributionByType,
    selectSiteAddress,
    selectSiteSoilsDistribution,
  },
);

export const makeUrbanProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`urbanProject/${actionName}`);
};
