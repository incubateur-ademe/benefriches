import { createReconversionProjectRequestDtoSchema } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { projectCreated } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";

import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

export const customUrbanProjectSaved = createAppAsyncThunk(
  makeUrbanProjectCreationActionType("customProjectSaved"),
  async (_, { getState, extra, dispatch }) => {
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
    void dispatch(eventTracked(projectCreated("custom")));
  },
  {
    // A double click on "Valider" must not send the project twice: the second POST with the
    // same id would be rejected and could leave the summary in error while the project exists.
    condition: (_, { getState }) =>
      getState().projectCreation.urbanProject.form.saveState !== "loading",
  },
);
