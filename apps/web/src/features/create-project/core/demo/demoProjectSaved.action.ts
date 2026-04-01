import { RenewableEnergyTemplate, UrbanProjectTemplate } from "shared";
import {
  BaseReconversionProjectFeaturesView,
  ReconversionProjectTemplate,
  reconversionProjectTemplateSchema,
} from "shared";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { makeProjectCreationActionType } from "../actions/actionsUtils";
import { stepCompletionRequested } from "./demoProject.reducer";

const makeDemoProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`demo/${actionName}`);
};

export const saveExpressProjectSchema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  createdBy: z.string(),
  template: reconversionProjectTemplateSchema,
});

type ExpressReconversionProjectPayload = z.infer<typeof saveExpressProjectSchema>;
export type ExpressReconversionProjectResult = BaseReconversionProjectFeaturesView;

export interface CreateExpressReconversionProjectGateway {
  get(params: {
    siteId: string;
    createdBy: string;
    template: ReconversionProjectTemplate;
  }): Promise<ExpressReconversionProjectResult>;
  save(payload: ExpressReconversionProjectPayload): Promise<void>;
}

export const demoProjectSaved = createAppAsyncThunk(
  makeDemoProjectCreationActionType("projectSaved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      template:
        projectCreation.demoProject.steps.DEMO_PROJECT_TEMPLATE_SELECTION?.payload?.projectTemplate,
      createdBy: currentUser.currentUser?.id,
    });

    await extra.createExpressReconversionProjectService.save(expressProjectPayload);
  },
);

export const demoProjectCreated = createAppAsyncThunk<
  ExpressReconversionProjectResult,
  UrbanProjectTemplate | RenewableEnergyTemplate
>(
  makeDemoProjectCreationActionType("projectCreated"),
  async (projectTemplate, { getState, extra, dispatch }) => {
    const { projectCreation, currentUser } = getState();

    void dispatch(
      stepCompletionRequested({
        stepId: "DEMO_PROJECT_TEMPLATE_SELECTION",
        answers: { projectTemplate },
      }),
    );

    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      template: projectTemplate,
      createdBy: currentUser.currentUser?.id,
    });

    return extra.createExpressReconversionProjectService.get(expressProjectPayload);
  },
);
