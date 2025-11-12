import { isUrbanProjectTemplate } from "shared";

import { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

import {
  stepRevertAttempted,
  stepRevertConfirmationResolved,
  stepRevertConfirmed,
} from "../actions/actionsUtils";
import { projectSuggestionsCompleted } from "../actions/projectSuggestionCompleted.action";
import { ProjectCreationStep } from "../createProject.reducer";
import { selectShouldConfirmStepRevert } from "../createProject.selectors";
import { expressPhotovoltaicProjectCreated } from "../renewable-energy/actions/expressProjectSaved.action";
import { creationProjectFormUrbanActions } from "../urban-project/urbanProject.actions";
import { expressUrbanProjectCreated } from "../urban-project/urbanProjectExpressSaved.action";

export const setupProjectCreationListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: stepRevertAttempted,
    effect: async (_action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      const currentStep = listenerApi
        .getState()
        .projectCreation.stepsHistory.at(-1) as ProjectCreationStep;

      if (!selectShouldConfirmStepRevert(listenerApi.getState())) {
        listenerApi.dispatch(stepRevertConfirmed({ revertedStep: currentStep }));
        return;
      }

      const [confirmationAction] = await listenerApi.take((action) =>
        stepRevertConfirmationResolved.match(action),
      );

      if (confirmationAction.payload.confirmed) {
        listenerApi.dispatch(stepRevertConfirmed({ revertedStep: currentStep }));
      }
    },
  });
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
