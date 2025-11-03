import { updateReconversionProjectPropsSchema } from "shared";
import z from "zod";

import { createProjectFormActions } from "@/shared/core/reducers/project-form/projectForm.actions";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";
import { createUrbanProjectFormActions } from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";
import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import {
  selectProjectSoilsDistribution,
  selectSiteAddress,
  selectSiteSoilsDistribution,
} from "./updateProject.selectors";
import { UpdateProjectView } from "./updateProject.types";

const UPDATE_PROJECT_STORE_KEY = "projectUpdate";

export const makeProjectUpdateActionType = (actionName: string) => {
  return `${UPDATE_PROJECT_STORE_KEY}/${actionName}`;
};

export const updateProjectFormActions = createProjectFormActions(UPDATE_PROJECT_STORE_KEY);
export const updateProjectFormUrbanActions = createUrbanProjectFormActions(
  UPDATE_PROJECT_STORE_KEY,
  {
    selectProjectSoilsDistribution,
    selectSiteAddress,
    selectSiteSoilsDistribution,
  },
);

export const reconversionProjectUpdateInitiated = createAppAsyncThunk<UpdateProjectView, string>(
  makeProjectUpdateActionType("init"),
  async (projectId, { extra }) => {
    const result = await extra.updateProjectService.getById(projectId);

    if (!result) throw new Error("Project not found");

    return result;
  },
);

export const reconversionProjectUpdateSaved = createAppAsyncThunk(
  makeProjectUpdateActionType("projectUpdateSaved"),
  async (_, { getState, extra }) => {
    const { projectUpdate } = getState();
    const { urbanProject, projectData } = projectUpdate;

    const updateData = ReadStateHelper.getProjectData(urbanProject.steps);

    const projectId = z.string().parse(projectData?.id);
    const projectToSave = updateReconversionProjectPropsSchema.parse(updateData);

    await extra.updateProjectService.save(projectId, projectToSave);
  },
);
