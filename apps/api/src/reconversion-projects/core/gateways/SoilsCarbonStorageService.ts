import { SoilsDistribution, SoilType } from "shared";

export type SoilsCarbonStorage = {
  total: number;
} & Partial<Record<SoilType, number>>;

export type SoilsCarbonStorageInput = {
  cityCode: string;
  soilsDistribution: SoilsDistribution;
};

export interface GetCarbonStorageFromSoilDistributionService {
  execute(input: SoilsCarbonStorageInput): Promise<SoilsCarbonStorage | undefined>;
}
