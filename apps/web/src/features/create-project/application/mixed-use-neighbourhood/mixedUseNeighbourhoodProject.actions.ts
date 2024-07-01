import { createAction as _createAction } from "@reduxjs/toolkit";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

const createAction = <TPayload>(actionName: string) =>
  _createAction<TPayload>(`projectCreation/mixedUseNeighbourhood/${actionName}`);

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const createModeStepReverted = createAction<void>("createModeStepReverted");

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

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const confirmationStepReverted = createAction<void>("confirmationStepReverted");
