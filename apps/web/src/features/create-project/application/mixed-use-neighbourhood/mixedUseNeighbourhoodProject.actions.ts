import { createAction as _createAction } from "@reduxjs/toolkit";
import { UrbanSpaceCategory } from "shared";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

function prefixActionType(actionType: string) {
  return `projectCreation/mixedUseNeighbourhood/${actionType}`;
}

const createAction = <TPayload = void>(actionName: string) =>
  _createAction<TPayload>(prefixActionType(actionName));

export const createModeStepReverted = createAction("createModeStepReverted");

const schema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  createdBy: z.string(),
});
type ExpressReconversionProjectPayload = z.infer<typeof schema>;
export interface SaveExpressReconversionProjectGateway {
  save(payload: ExpressReconversionProjectPayload): Promise<void>;
}
export const expressCreateModeSelected = createAppAsyncThunk(
  prefixActionType("expressCreateModeSelected"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const expressProjectPayload = await schema.parseAsync({
      reconversionProjectId: projectCreation.projectData.id,
      siteId: projectCreation.siteData?.id,
      createdBy: currentUser.currentUser?.id,
    });

    await extra.saveExpressReconversionProjectService.save(expressProjectPayload);
  },
);

export const resultStepReverted = createAction("resultStepReverted");

export const customCreateModeSelected = createAction("customCreateModeSelected");

export const spacesIntroductionCompleted = createAction("spacesIntroductionCompleted");
export const spacesIntroductionReverted = createAction("spacesIntroductionReverted");
export const spacesSelectionCompleted = createAction<{
  spacesCategories: UrbanSpaceCategory[];
}>("spacesSelectionCompleted");
export const spacesSelectionReverted = createAction("spacesSelectionReverted");
export const spacesSurfaceAreaCompleted = createAction<{
  surfaceAreaDistribution: Partial<Record<UrbanSpaceCategory, number>>;
}>("spacesSurfaceAreaCompleted");
export const spacesSurfaceAreaReverted = createAction("spacesSurfaceAreaReverted");
