import type { CreateReconversionProjectRequestDto } from "shared";

export type SaveProjectPayload = CreateReconversionProjectRequestDto;

export interface SaveReconversionProjectGateway {
  save(siteData: SaveProjectPayload): Promise<void>;
}
