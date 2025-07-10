import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import {
  ReconversionProject,
  saveExpressProjectSchema,
} from "../../actions/expressProjectSavedGateway";
import { makeRenewableEnergyProjectCreationActionType } from "./renewableEnergy.actions";

export const expressPhotovoltaicProjectSaved = createAppAsyncThunk<ReconversionProject>(
  makeRenewableEnergyProjectCreationActionType("expressPhotovoltaicProjectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      category: "PHOTOVOLTAIC_POWER_PLANT",
      createdBy: currentUser.currentUser?.id,
    });

    return await extra.saveExpressReconversionProjectService.save(expressProjectPayload);
  },
);
