import { LocalStorageCreateSiteApi } from "./features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { SoilsCarbonStorageApi } from "./features/create-site/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";
import { AppDependencies } from "./store";

export const appDependencies: AppDependencies = {
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new LocalStorageCreateSiteApi(),
};
