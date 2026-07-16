import { createWizardFormActions } from "@/features/create-project/core/project-form/siteRelatedLocalAuthorities.action";

export const { fetchSiteRelatedLocalAuthorities } = createWizardFormActions(
  "projectCreation",
  (state) => state.projectCreation,
);
