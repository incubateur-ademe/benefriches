import { saveReconversionProjectPropsSchema } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

export const customUrbanProjectSaved = createAppAsyncThunk(
  makeUrbanProjectCreationActionType("customProjectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const { urbanProject, siteData, projectId } = projectCreation;

    const creationData = ReadStateHelper.getProjectData(urbanProject.steps);

    const mappedProjectData = {
      id: projectId,
      createdBy: currentUser.currentUser?.id,
      relatedSiteId: siteData?.id,
      ...creationData,
    };

    const projectToSave = saveReconversionProjectPropsSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
