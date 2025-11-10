import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { ProjectSite, ProjectSuggestion } from "../project.types";
import { makeProjectCreationActionType } from "./actionsUtils";

export interface GetSitesByIdGateway {
  getById(siteId: string): Promise<ProjectSite | undefined>;
}

export const reconversionProjectCreationInitiated = createAppAsyncThunk<
  ProjectSite,
  { relatedSiteId: string; withProjectSuggestions?: ProjectSuggestion[] }
>(makeProjectCreationActionType("initiated"), async ({ relatedSiteId }, { extra }) => {
  const projectSite = await extra.getSiteByIdService.getById(relatedSiteId);

  if (!projectSite) throw new Error("Site not found");

  return projectSite;
});
