import { saveReconversionProjectPropsSchema } from "shared";
import { z } from "zod";

export type SaveProjectPayload = z.infer<typeof saveReconversionProjectPropsSchema>;

export interface SaveReconversionProjectGateway {
  save(siteData: SaveProjectPayload): Promise<void>;
}
