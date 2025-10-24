import { createProjectFormActions } from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";

import {
  makeProjectCreationActionType,
  PROJECT_CREATION_ACTION_PREFIX,
} from "../actions/actionsUtils";
import { selectSiteAddress, selectSiteSoilsDistribution } from "../createProject.selectors";
import { selectProjectSoilsDistribution } from "./urbanProject.selectors";

export const creationProjectFormActions = createProjectFormActions(PROJECT_CREATION_ACTION_PREFIX, {
  selectSiteSoilsDistribution,
  selectSiteAddress,
  selectProjectSoilsDistribution,
});

export const makeUrbanProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`urbanProject/${actionName}`);
};

export default creationProjectFormActions;
