import { SoilsDistribution, SoilsCarbonStorage as SharedSoilsCarbonStorage } from "shared";

export type SoilsCarbonStorageInput = {
  cityCode: string;
  soilsDistribution: SoilsDistribution;
};

export interface GetCarbonStorageFromSoilDistributionService {
  execute(input: SoilsCarbonStorageInput): Promise<SoilsCarbonStorage | undefined>;
}

export type SoilsCarbonStorage = SharedSoilsCarbonStorage;
