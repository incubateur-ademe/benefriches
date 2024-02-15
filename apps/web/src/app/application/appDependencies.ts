import { AppDependencies } from "./store";

import { ExpectedPhotovoltaicPerformanceApi } from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceApi";
import { LocalStorageSaveProjectApi } from "@/features/create-project/infrastructure/save-project-service/localStorageSaveSiteService";
import { HttpSitesService } from "@/features/create-project/infrastructure/sites-service/HttpSiteService";
import { HttpCreateSiteApi } from "@/features/create-site/infrastructure/create-site-service/HttpCreateSiteApi";
import { LocalStorageProjectDetailsApi } from "@/features/projects/infrastructure/project-details-service/localStorageProjectDetailsApi";
import { LocalStorageProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
import { LocalStorageSitesApi } from "@/features/projects/infrastructure/sites-service/localStorageSitesApi";
import { LocalStorageUserService } from "@/features/users/infra/get-user-service/LocalStorageUserService";
import { LocalAuthoritiesGeoApi } from "@/shared/infrastructure/local-authorities-service/localAuthoritiesGeoApi";
import { SoilsCarbonStorageApi } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";

export const appDependencies: AppDependencies = {
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new HttpCreateSiteApi(),
  getSiteByIdService: new HttpSitesService(),
  projectsListService: new LocalStorageProjectsListApi(),
  projectDetailsService: new LocalStorageProjectDetailsApi(),
  sitesService: new LocalStorageSitesApi(),
  saveProjectGateway: new LocalStorageSaveProjectApi(),
  photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceApi(),
  localAuthoritiesService: new LocalAuthoritiesGeoApi(),
  userService: new LocalStorageUserService(),
};
