import { createProjectCreationAction } from "./actionsUtils";

export const surfaceAreaInputModeUpdated = createProjectCreationAction<
  "percentage" | "squareMeters"
>("surfaceAreaInputModeUpdated");
