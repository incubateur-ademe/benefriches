import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { saveProjectSchema } from "../actions/saveReconversionProject.action";
import { FormState } from "./form-state/formState";
import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

export const customUrbanProjectSaved = createAppAsyncThunk(
  makeUrbanProjectCreationActionType("customProjectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const { urbanProjectEventSourcing, siteData, projectId } = projectCreation;

    const creationData = FormState.getProjectData(urbanProjectEventSourcing.events);

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
