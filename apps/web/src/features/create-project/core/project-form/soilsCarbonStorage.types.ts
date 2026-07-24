import type { SoilsCarbonStorageResult } from "@/shared/core/gateways/SoilsCarbonStorageGateway";

export type {
  GetSoilsCarbonStoragePayload,
  SoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/shared/core/gateways/SoilsCarbonStorageGateway";

export type CurrentAndProjectedSoilsCarbonStorageResult = {
  current: SoilsCarbonStorageResult;
  projected: SoilsCarbonStorageResult;
};
