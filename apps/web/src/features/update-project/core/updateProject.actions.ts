import { httpUpdateReconversionProjectPropsSchema } from "shared";
import z from "zod";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { createWizardFormActions } from "@/features/create-project/core/project-form/siteRelatedLocalAuthorities.action";
import { getProjectData as getRenewableEnergyProjectData } from "@/features/create-project/core/renewable-energy/helpers/readers/projectDataReaders";
import { createRenewableEnergyFormActions } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";
import { createUrbanProjectFormActions } from "@/features/create-project/core/urban-project/urbanProjectForm.actions";

import {
  selectProjectSoilsDistributionByType,
  selectSiteAddress,
  selectSiteSoilsDistribution,
  updateRenewableEnergyFormSelectors,
} from "./updateProject.selectors";
import { UpdateProjectView } from "./updateProject.types";

const UPDATE_PROJECT_STORE_KEY = "projectUpdate";

const makeProjectUpdateActionType = (actionName: string) => {
  return `${UPDATE_PROJECT_STORE_KEY}/${actionName}`;
};

export const updateProjectFormActions = createWizardFormActions(
  UPDATE_PROJECT_STORE_KEY,
  (state) => state.projectUpdate,
);
export const updateProjectFormUrbanActions = createUrbanProjectFormActions(
  UPDATE_PROJECT_STORE_KEY,
  {
    selectProjectSoilsDistributionByType,
    selectSiteAddress,
    selectSiteSoilsDistribution,
  },
);
export const updateProjectFormRenewableEnergyActions = createRenewableEnergyFormActions(
  UPDATE_PROJECT_STORE_KEY,
  updateRenewableEnergyFormSelectors,
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
    const { urbanProject, renewableEnergyProject, projectData } = projectUpdate;

    const updateData =
      projectData.projectType === "PHOTOVOLTAIC_POWER_PLANT"
        ? getRenewableEnergyProjectData(renewableEnergyProject.steps)
        : getProjectData(urbanProject.form.steps);

    const projectId = z.string().parse(projectData?.id);
    const projectToSave = httpUpdateReconversionProjectPropsSchema.parse({
      ...updateData,
      projectPhase: projectData.projectPhase,
    });

    await extra.updateProjectService.save(projectId, projectToSave);
  },
);
