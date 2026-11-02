import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { ProjectSite, ProjectSuggestion } from "../project.types";
import { makeProjectCreationActionType } from "./actionsUtils";

export interface GetSitesByIdGateway {
  // Resolves to undefined when no site has this id (unknown or malformed id).
  getSiteFeaturesById(siteId: string): Promise<ProjectSite | undefined>;
}

export const reconversionProjectCreationInitiated = createAppAsyncThunk<
  ProjectSite,
  { relatedSiteId: string; projectSuggestions?: ProjectSuggestion[] },
  { rejectValue: "notFound" }
>(
  makeProjectCreationActionType("initiated"),
  async ({ relatedSiteId }, { extra, rejectWithValue }) => {
    const projectSite = await extra.getSiteByIdService.getSiteFeaturesById(relatedSiteId);

    if (!projectSite) return rejectWithValue("notFound");

    return projectSite;
  },
);
