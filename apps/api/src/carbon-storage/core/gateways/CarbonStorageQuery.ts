import { CarbonStorage, RepositorySoilCategoryType } from "../models/carbonStorage";

export interface CarbonStorageQuery {
  getCarbonStorageForCity(
    cityCode: string,
    soilCategories: RepositorySoilCategoryType[],
  ): Promise<CarbonStorage[]>;
}
