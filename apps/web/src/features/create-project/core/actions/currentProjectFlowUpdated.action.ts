import { CurrentProjectFlow } from "../createProject.reducer";
import { createProjectCreationAction } from "./actionsUtils";

export const currentProjectFlowUpdated = createProjectCreationAction<CurrentProjectFlow>(
  "currentProjectFlowUpdated",
);
