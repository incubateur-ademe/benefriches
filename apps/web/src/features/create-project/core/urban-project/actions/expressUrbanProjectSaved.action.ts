import { z } from "zod";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { prefixActionType } from "./urbanProject.actions";

const schema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  createdBy: z.string(),
  category: z.enum([
    "PUBLIC_FACILITIES",
    "RESIDENTIAL_TENSE_AREA",
    "RESIDENTIAL_NORMAL_AREA",
    "NEW_URBAN_CENTER",
  ]),
});
type ExpressReconversionProjectPayload = z.infer<typeof schema>;

export interface SaveExpressReconversionProjectGateway {
  save(payload: ExpressReconversionProjectPayload): Promise<{ id: string; name: string }>;
}
export const expressUrbanProjectSaved = createAppAsyncThunk<
  { id: string; name: string },
  ExpressReconversionProjectPayload["category"]
>(prefixActionType("expressUrbanProjectSaved"), async (expressCategory, { getState, extra }) => {
  const { projectCreation, currentUser } = getState();
  const expressProjectPayload = await schema.parseAsync({
    reconversionProjectId: projectCreation.projectId,
    siteId: projectCreation.siteData?.id,
    category: expressCategory,
    createdBy: currentUser.currentUser?.id,
  });

  return await extra.saveExpressReconversionProjectService.save(expressProjectPayload);
});
