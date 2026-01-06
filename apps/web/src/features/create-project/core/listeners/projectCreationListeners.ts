import { isUrbanProjectTemplate } from "shared";

import { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

import { projectSuggestionsCompleted } from "../actions/projectSuggestionCompleted.action";
import { expressPhotovoltaicProjectCreated } from "../renewable-energy/actions/expressProjectSaved.action";
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
};
