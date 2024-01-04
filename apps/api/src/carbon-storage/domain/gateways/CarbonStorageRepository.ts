import { CarbonStorage, RepositorySoilCategoryType } from "../models/carbonStorage";

export interface CarbonStorageRepository {
  getCarbonStorageForCity(
    cityCode: string,
    soilCategories: RepositorySoilCategoryType[],
  ): Promise<CarbonStorage[]>;
}
