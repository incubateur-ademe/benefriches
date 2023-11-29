import { LocalStorageGetSiteApi } from "./features/create-project/infrastructure/get-site-service/localStorageGetSiteService";
import { LocalStorageSaveProjectApi } from "./features/create-project/infrastructure/save-project-service/localStorageSaveSiteService";
import { LocalStorageCreateSiteApi } from "./features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { LocalStorageProjectDetailsApi } from "./features/projects/infrastructure/project-details-service/localStorageProjectDetailsApi";
import { LocalStorageProjectsListApi } from "./features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
import { LocalStorageSitesApi } from "./features/projects/infrastructure/sites-service/localStorageSitesApi";
import { SoilsCarbonStorageApi } from "./shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";
import { AppDependencies } from "./store";

export const appDependencies: AppDependencies = {
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new LocalStorageCreateSiteApi(),
  getSiteService: new LocalStorageGetSiteApi(),
  projectsListService: new LocalStorageProjectsListApi(),
  projectDetailsService: new LocalStorageProjectDetailsApi(),
  sitesService: new LocalStorageSitesApi(),
  saveProjectGateway: new LocalStorageSaveProjectApi(),
};
