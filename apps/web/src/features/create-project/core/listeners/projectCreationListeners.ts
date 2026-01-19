import { isUrbanProjectTemplate } from "shared";

import { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

import { projectSuggestionsCompleted } from "../actions/projectSuggestionCompleted.action";
import { expressPhotovoltaicProjectCreated } from "../renewable-energy/actions/expressProjectSaved.action";
import { fetchEstimatedSiteResalePrice } from "../urban-project/fetchEstimatedSiteResalePrice.action";
import { creationProjectFormUrbanActions } from "../urban-project/urbanProject.actions";
import { expressUrbanProjectCreated } from "../urban-project/urbanProjectExpressSaved.action";

export const setupProjectCreationListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: projectSuggestionsCompleted,
    effect: (action, listenerApi) => {
      if (action.payload.selectedOption === "PHOTOVOLTAIC_POWER_PLANT") {
        void listenerApi.dispatch(expressPhotovoltaicProjectCreated());
      }
      if (isUrbanProjectTemplate(action.payload.selectedOption)) {
        listenerApi.dispatch(
          creationProjectFormUrbanActions.requestStepCompletion({
            stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",
            answers: { createMode: "express" },
          }),
        );
        void listenerApi.dispatch(expressUrbanProjectCreated(action.payload.selectedOption));
      }
    },
  });

  // Listen for site resale step completion to auto-compute price when "unknown" is selected
  startAppListening({
    actionCreator: creationProjectFormUrbanActions.requestStepCompletion,
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
