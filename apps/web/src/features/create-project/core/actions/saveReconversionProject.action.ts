import type { httpSaveReconversionProjectPropsSchema } from "shared";
import type { z } from "zod";

export type SaveProjectPayload = z.infer<typeof httpSaveReconversionProjectPropsSchema>;

export interface SaveReconversionProjectGateway {
  save(siteData: SaveProjectPayload): Promise<void>;
}
