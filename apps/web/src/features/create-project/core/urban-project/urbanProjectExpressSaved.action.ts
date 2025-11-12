import { UrbanProjectTemplate } from "shared";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import {
  ExpressReconversionProjectResult,
  saveExpressProjectSchema,
} from "../actions/expressProjectSavedGateway";
import {
  creationProjectFormUrbanActions,
  makeUrbanProjectCreationActionType,
} from "./urbanProject.actions";

export const expressUrbanProjectSaved = createAppAsyncThunk(
  makeUrbanProjectCreationActionType("expressUrbanProjectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      template:
        projectCreation.urbanProject.steps.URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION?.payload
          ?.projectTemplate,
      createdBy: currentUser.currentUser?.id,
    });

    await extra.createExpressReconversionProjectService.save(expressProjectPayload);
  },
);

export const expressUrbanProjectCreated = createAppAsyncThunk<
  ExpressReconversionProjectResult,
  UrbanProjectTemplate
>(
  makeUrbanProjectCreationActionType("expressUrbanProjectCreated"),
  async (urbanProjectTemplate, { getState, extra, dispatch }) => {
    const { projectCreation, currentUser } = getState();

    void dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION",
        answers: { projectTemplate: urbanProjectTemplate },
      }),
    );

    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      template: urbanProjectTemplate,
      createdBy: currentUser.currentUser?.id,
    });

    return extra.createExpressReconversionProjectService.get(expressProjectPayload);
  },
);
