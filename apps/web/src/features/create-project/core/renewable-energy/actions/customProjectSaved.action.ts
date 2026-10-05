import { createReconversionProjectRequestDtoSchema } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { getProjectData } from "../helpers/readers/projectDataReaders";
import { makeRenewableEnergyProjectCreationActionType } from "../renewableEnergy.actions";

export const saveReconversionProject = createAppAsyncThunk(
  makeRenewableEnergyProjectCreationActionType("saved"),
  async (_, { getState, extra }) => {
    const { projectCreation } = getState();
    const { renewableEnergyProject, siteData, projectId, useCaseSelection } = projectCreation;

    const creationData = getProjectData(renewableEnergyProject.steps);

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
