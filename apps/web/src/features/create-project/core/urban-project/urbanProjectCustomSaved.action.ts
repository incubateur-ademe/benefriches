import { createReconversionProjectRequestDtoSchema } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";

import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

export const customUrbanProjectSaved = createAppAsyncThunk(
  makeUrbanProjectCreationActionType("customProjectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation } = getState();
    const { urbanProject, siteData, projectId, useCaseSelection } = projectCreation;

    const creationData = getProjectData(urbanProject.form.steps);

    const mappedProjectData = {
      id: projectId,
      relatedSiteId: siteData?.id,
      projectPhase: useCaseSelection.projectPhase,
      ...creationData,
    };

    const projectToSave = createReconversionProjectRequestDtoSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
