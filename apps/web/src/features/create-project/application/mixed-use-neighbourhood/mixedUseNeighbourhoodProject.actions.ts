import { createAction as _createAction } from "@reduxjs/toolkit";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

const createAction = (actionName: string) =>
  _createAction(`projectCreation/mixedUseNeighbourhood/${actionName}`);

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
  "projectCreation/mixedUseNeighbourhood/expressCreateModeSelected",
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
