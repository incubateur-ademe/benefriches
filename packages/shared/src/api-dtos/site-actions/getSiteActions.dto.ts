import z from "zod";

import { siteActionStatusSchema, siteActionTypeSchema } from "../../siteActions";

export const getSiteActionsResponseDtoSchema = z.array(
  z.object({
    id: z.string(),
    siteId: z.string(),
    actionType: siteActionTypeSchema,
    status: siteActionStatusSchema,
  }),
);

export type GetSiteActionsResponseDto = z.infer<typeof getSiteActionsResponseDtoSchema>;
