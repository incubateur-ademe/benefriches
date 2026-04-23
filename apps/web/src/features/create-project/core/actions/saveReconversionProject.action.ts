import { httpSaveReconversionProjectPropsSchema } from "shared";
import { z } from "zod";

export type SaveProjectPayload = z.infer<typeof httpSaveReconversionProjectPropsSchema>;

export interface SaveReconversionProjectGateway {
  save(siteData: SaveProjectPayload): Promise<void>;
}
