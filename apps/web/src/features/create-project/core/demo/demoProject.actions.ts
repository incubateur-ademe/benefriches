import { createAction } from "@reduxjs/toolkit";
import type { RenewableEnergyTemplate, UrbanProjectTemplate } from "shared";
import type { BaseReconversionProjectFeaturesView, ReconversionProjectTemplate } from "shared";
import { reconversionProjectTemplateSchema } from "shared";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { makeProjectCreationActionType } from "../actions/actionsUtils";
import { stepCompletionRequested } from "./demoProject.reducer";
import type { DemoProjectCreationStep } from "./demoSteps";

const makeDemoProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`demo/${actionName}`);
};

export const saveExpressProjectSchema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  template: reconversionProjectTemplateSchema,
});

// Generating a preview still sends createdBy as a query parameter: only the save derives it from the session.
const generateExpressProjectSchema = saveExpressProjectSchema.extend({
  createdBy: z.string(),
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
    const { projectCreation } = getState();
    const expressProjectPayload = await saveExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      template:
        projectCreation.demoProject.steps.DEMO_PROJECT_TEMPLATE_SELECTION?.payload?.projectTemplate,
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

    const expressProjectPayload = await generateExpressProjectSchema.parseAsync({
      reconversionProjectId: projectCreation.projectId,
      siteId: projectCreation.siteData?.id,
      template: projectTemplate,
      createdBy: currentUser.currentUser?.id,
    });

    return extra.createExpressReconversionProjectService.get(expressProjectPayload);
  },
);

export const demoStepGroupNavigated = createAction<DemoProjectCreationStep>(
  makeDemoProjectCreationActionType("demoStepGroupNavigated"),
);
