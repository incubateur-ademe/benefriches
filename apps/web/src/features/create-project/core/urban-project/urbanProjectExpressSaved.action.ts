import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import {
  ExpressReconversionProjectPayload,
  ExpressReconversionProjectResult,
  saveExpressProjectSchema,
} from "../actions/expressProjectSavedGateway";
import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

export const expressUrbanProjectSaved = createAppAsyncThunk(
  makeUrbanProjectCreationActionType("expressUrbanProjectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      category:
        projectCreation.urbanProject.steps.URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION?.payload
          ?.expressCategory,
      createdBy: currentUser.currentUser?.id,
    });

    await extra.createExpressReconversionProjectService.save(expressProjectPayload);
  },
);

export const expressUrbanProjectCreated = createAppAsyncThunk<
  ExpressReconversionProjectResult,
  ExpressReconversionProjectPayload["category"]
>(
  makeUrbanProjectCreationActionType("expressUrbanProjectCreated"),
  async (expressCategory, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      category: expressCategory,
      createdBy: currentUser.currentUser?.id,
    });

    return await extra.createExpressReconversionProjectService.get(expressProjectPayload);
  },
);
