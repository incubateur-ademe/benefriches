import { LocalStorageGetSiteApi } from "./features/create-project/infrastructure/get-site-service/localStorageGetSiteService";
import { LocalStorageCreateSiteApi } from "./features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { SoilsCarbonStorageApi } from "./features/create-site/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";
import { LocalStorageProjectsListApi } from "./features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
import { AppDependencies } from "./store";

export const appDependencies: AppDependencies = {
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new LocalStorageCreateSiteApi(),
  getSiteService: new LocalStorageGetSiteApi(),
  projectsListService: new LocalStorageProjectsListApi(),
};
