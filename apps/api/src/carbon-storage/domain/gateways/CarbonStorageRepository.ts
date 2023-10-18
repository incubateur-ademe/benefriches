import { CarbonStorage, SoilCategoryType } from "../models/carbonStorage";

export interface CarbonStorageRepository {
  getCarbonStorageForCity(
    cityCode: string,
    soilCategories: SoilCategoryType[],
  ): Promise<CarbonStorage[]>;
}
