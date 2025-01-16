import { LocalStorageAppSettings } from "@/features/app-settings/infrastructure/LocalStorageAppSettings";
import { ExpectedPhotovoltaicPerformanceApi } from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceApi";
import HttpSaveExpressReconversionProjectService from "@/features/create-project/infrastructure/save-express-project-service/HttpSaveExpressReconversionProjectService";
import { HttpSaveReconversionProjectService } from "@/features/create-project/infrastructure/save-project-service/HttpSaveReconversionProjectService";
import { HttpSitesService } from "@/features/create-project/infrastructure/sites-service/HttpSiteService";
import { HttpCreateSiteApi } from "@/features/create-site/infrastructure/create-site-service/HttpCreateSiteApi";
import { HttpProjectFeaturesService } from "@/features/projects/infrastructure/project-features-service/HttpProjectFeaturesService";
import { HttpReconversionProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/HttpProjectsListApi";
import { HttpReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/HttpReconversionProjectImpactsService";
import { HttpSiteFeaturesService } from "@/features/site-features/infra/site-features-service/HttpSiteFeaturesService";
import { AdministrativeDivisionGeoApi } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionGeoApi";
import { SoilsCarbonStorageApi } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";
import { HttpCreateUserService } from "@/users/infra/create-user-service/HttpCreateUserService";
import { LocalStorageUserService } from "@/users/infra/current-user-service/LocalStorageUserService";

import { AppDependencies } from "./store";

export const appDependencies: AppDependencies = {
  appSettingsService: new LocalStorageAppSettings(),
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new HttpCreateSiteApi(),
  getSiteByIdService: new HttpSitesService(),
  reconversionProjectsListService: new HttpReconversionProjectsListApi(),
  saveReconversionProjectService: new HttpSaveReconversionProjectService(),
  saveExpressReconversionProjectService: new HttpSaveExpressReconversionProjectService(),
  reconversionProjectImpacts: new HttpReconversionProjectImpactsApi(),
  photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceApi(),
  municipalityDataService: new AdministrativeDivisionGeoApi(),
  currentUserService: new LocalStorageUserService(),
  createUserService: new HttpCreateUserService(),
  siteFeaturesService: new HttpSiteFeaturesService(),
  projectFeaturesService: new HttpProjectFeaturesService(),
};
