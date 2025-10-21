import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import {
  ExpressReconversionProjectResult,
  saveExpressProjectSchema,
} from "../../actions/expressProjectSavedGateway";
import { makeRenewableEnergyProjectCreationActionType } from "./renewableEnergy.actions";

export const expressPhotovoltaicProjectSaved = createAppAsyncThunk(
  makeRenewableEnergyProjectCreationActionType("expressPhotovoltaicProjectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      category: "PHOTOVOLTAIC_POWER_PLANT",
      createdBy: currentUser.currentUser?.id,
    });

    await extra.createExpressReconversionProjectService.save(expressProjectPayload);
  },
);

export const expressPhotovoltaicProjectCreated =
  createAppAsyncThunk<ExpressReconversionProjectResult>(
    makeRenewableEnergyProjectCreationActionType("expressPhotovoltaicProjectCreated"),
    async (_, { getState, extra }) => {
      const { projectCreation, currentUser } = getState();

      if (!projectCreation.siteData?.id || !currentUser.currentUser?.id) {
        throw new Error("Missing siteId or currentUserId");
      }

      return extra.createExpressReconversionProjectService.get({
        siteId: projectCreation.siteData.id,
        category: "PHOTOVOLTAIC_POWER_PLANT",
        createdBy: currentUser.currentUser.id,
      });
    },
  );
