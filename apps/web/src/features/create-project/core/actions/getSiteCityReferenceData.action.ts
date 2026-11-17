import { createWizardFormActions } from "@/features/create-project/core/project-form/siteCityReferenceData.action";

export const { fetchSiteCityReferenceData } = createWizardFormActions(
  "projectCreation",
  (state) => state.projectCreation,
);
