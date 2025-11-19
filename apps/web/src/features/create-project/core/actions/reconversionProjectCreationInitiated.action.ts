import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { ProjectSite, ProjectSuggestion } from "../project.types";
import { makeProjectCreationActionType } from "./actionsUtils";

export interface GetSitesByIdGateway {
  getSiteFeaturesById(siteId: string): Promise<ProjectSite | undefined>;
}

export const reconversionProjectCreationInitiated = createAppAsyncThunk<
  ProjectSite,
  { relatedSiteId: string; projectSuggestions?: ProjectSuggestion[] }
>(makeProjectCreationActionType("initiated"), async ({ relatedSiteId }, { extra }) => {
  const projectSite = await extra.getSiteByIdService.getSiteFeaturesById(relatedSiteId);

  if (!projectSite) throw new Error("Site not found");

  return projectSite;
});
