import { reconversionProjectPropsSchema } from "shared";
import { z } from "zod";

export const saveProjectSchema = reconversionProjectPropsSchema;

export type SaveProjectPayload = z.infer<typeof saveProjectSchema>;

export interface SaveReconversionProjectGateway {
  save(siteData: SaveProjectPayload): Promise<void>;
}
