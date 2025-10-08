import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import {
  ExpressReconversionProjectPayload,
  ReconversionProject,
  saveExpressProjectSchema,
} from "../actions/expressProjectSavedGateway";
import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

export const expressUrbanProjectSaved = createAppAsyncThunk<
  ReconversionProject,
  ExpressReconversionProjectPayload["category"]
>(
  makeUrbanProjectCreationActionType("expressUrbanProjectSaved"),
  async (expressCategory, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      category: expressCategory,
      createdBy: currentUser.currentUser?.id,
    });

    return await extra.saveExpressReconversionProjectService.save(expressProjectPayload);
  },
);
