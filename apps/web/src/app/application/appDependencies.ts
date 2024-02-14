import { AppDependencies } from "./store";

import { ExpectedPhotovoltaicPerformanceApi } from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceApi";
import { HttpSaveReconversionProjectService } from "@/features/create-project/infrastructure/save-project-service/HttpSaveReconversionProjectService";
import { HttpSitesService } from "@/features/create-project/infrastructure/sites-service/HttpSiteService";
import { HttpCreateSiteApi } from "@/features/create-site/infrastructure/create-site-service/HttpCreateSiteApi";
import { LocalStorageProjectDetailsApi } from "@/features/projects/infrastructure/project-details-service/localStorageProjectDetailsApi";
import { HttpReconversionProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/HttpProjectsListApi";
import { LocalStorageUserService } from "@/features/users/infra/get-user-service/LocalStorageUserService";
import { AdministrativeDivisionGeoApi } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionGeoApi";
import { SoilsCarbonStorageApi } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";

export const appDependencies: AppDependencies = {
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new HttpCreateSiteApi(),
  getSiteByIdService: new HttpSitesService(),
  reconversionProjectsListService: new HttpReconversionProjectsListApi(),
  projectDetailsService: new LocalStorageProjectDetailsApi(),
  saveReconversionProjectService: new HttpSaveReconversionProjectService(),
  photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceApi(),
  userService: new LocalStorageUserService(),
  municipalityDataService: new AdministrativeDivisionGeoApi(),
};
