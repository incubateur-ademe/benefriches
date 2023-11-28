import { LocalStorageGetSiteApi } from "./features/create-project/infrastructure/get-site-service/localStorageGetSiteService";
import { LocalStorageSaveProjectApi } from "./features/create-project/infrastructure/save-project-service/localStorageSaveSiteService";
import { LocalStorageCreateSiteApi } from "./features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { SoilsCarbonStorageApi } from "./features/create-site/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";
import { LocalStorageProjectsListApi } from "./features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
import { LocalStorageSitesApi } from "./features/projects/infrastructure/sites-service/localStorageSitesApi";
import { AppDependencies } from "./store";

export const appDependencies: AppDependencies = {
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new LocalStorageCreateSiteApi(),
  getSiteService: new LocalStorageGetSiteApi(),
  projectsListService: new LocalStorageProjectsListApi(),
  sitesService: new LocalStorageSitesApi(),
  saveProjectGateway: new LocalStorageSaveProjectApi(),
};
