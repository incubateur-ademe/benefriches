import { createWizardFormActions } from "@/features/create-project/core/project-form/siteRelatedLocalAuthorities.action";
import { createUrbanProjectFormActions } from "@/shared/core/wizard-form/urban-project/urbanProject.actions";

import {
  makeProjectCreationActionType,
  PROJECT_CREATION_ACTION_PREFIX,
} from "../actions/actionsUtils";
import { selectSiteAddress, selectSiteSoilsDistribution } from "../createProject.selectors";
import { selectProjectSoilsDistributionByType } from "./urbanProject.selectors";

export const creationProjectFormActions = createWizardFormActions(
  PROJECT_CREATION_ACTION_PREFIX,
  (state) => state.projectCreation,
);
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
