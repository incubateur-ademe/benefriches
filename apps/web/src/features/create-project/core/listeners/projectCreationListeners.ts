import { AppStartListening } from "@/app/store/listenerMiddleware";

import { fetchEstimatedSiteResalePrice } from "../urban-project/fetchEstimatedSiteResalePrice.action";
import { creationProjectFormUrbanActions } from "../urban-project/urbanProject.actions";

export const setupProjectCreationListeners = (startAppListening: AppStartListening) => {
  // Listen for site resale step completion to auto-compute price when "unknown" is selected
  startAppListening({
    actionCreator: creationProjectFormUrbanActions.stepCompletionRequested,
    effect: (action, listenerApi) => {
      if (action.payload.stepId !== "URBAN_PROJECT_SITE_RESALE_SELECTION") {
        return;
      }

      const state = listenerApi.getState();
      const siteResaleSelection =
        state.projectCreation.urbanProject.steps.URBAN_PROJECT_SITE_RESALE_SELECTION?.payload
          ?.siteResaleSelection;

      if (siteResaleSelection !== "unknown") {
        return;
      }

      void listenerApi.dispatch(fetchEstimatedSiteResalePrice());
    },
  });
};
