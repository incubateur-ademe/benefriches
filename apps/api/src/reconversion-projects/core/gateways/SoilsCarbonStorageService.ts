import { SoilsDistribution } from "shared";

export interface GetCarbonStorageFromSoilDistributionService {
  execute(input: {
    cityCode: string;
    soilsDistribution: SoilsDistribution;
  }): Promise<number | undefined>;
}
