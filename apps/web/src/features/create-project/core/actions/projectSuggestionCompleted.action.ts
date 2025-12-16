import { ReconversionProjectTemplate } from "shared";

import { createProjectCreationAction } from "./actionsUtils";

export const projectSuggestionsCompleted = createProjectCreationAction<{
  selectedOption: ReconversionProjectTemplate | "none";
}>("projectSuggestionsCompleted");
