import type { AppStartListening } from "@/app/store/listenerMiddleware";

import { currentProjectFlowUpdated } from "../actions/currentProjectFlowUpdated.action";
import { creationProjectFormUrbanActions } from "../urban-project/urbanProject.actions";

export const setupProjectCreationListeners = (startAppListening: AppStartListening) => {
  // Listen for urban stepNavigationRequested to adapt currentProjectFlow if necessary
  // May be refactored to unify with others projects flow
  startAppListening({
    actionCreator: creationProjectFormUrbanActions.stepNavigationRequested,
    effect: (_, listenerApi) => {
      const state = listenerApi.getState();
      if (state.projectCreation.currentProjectFlow !== "URBAN_PROJECT") {
        void listenerApi.dispatch(currentProjectFlowUpdated("URBAN_PROJECT"));
      }
    },
  });
};
