import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { saveProjectSchema } from "../actions/saveReconversionProject.action";
import { ReadStateHelper } from "./helpers/readState";
import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

export const customUrbanProjectSaved = createAppAsyncThunk(
  makeUrbanProjectCreationActionType("customProjectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const { urbanProjectBeta, siteData, projectId } = projectCreation;

    const creationData = ReadStateHelper.getProjectData(urbanProjectBeta.steps);

    const mappedProjectData = {
      id: projectId,
      createdBy: currentUser.currentUser?.id,
      relatedSiteId: siteData?.id,
      ...creationData,
    };

    const projectToSave = saveProjectSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
