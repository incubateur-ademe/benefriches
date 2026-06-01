import z from "zod";

import { siteStatuQuoImpactsSchema } from "../../site";

export const getSiteImpactsResponseDtoSchema = siteStatuQuoImpactsSchema;

export type GetSiteImpactsDto = z.infer<typeof getSiteImpactsResponseDtoSchema>;
