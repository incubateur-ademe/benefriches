import { createAction } from "@reduxjs/toolkit";
import { ReconversionProjectTemplate } from "shared";

export const projectSuggestionsCompleted = createAction<{
  selectedOption: ReconversionProjectTemplate | "none";
}>("projectCreation/projectSuggestionsCompleted");
