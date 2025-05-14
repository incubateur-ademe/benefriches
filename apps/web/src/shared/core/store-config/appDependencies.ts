import { LocalStorageAppSettings } from "@/features/app-settings/infrastructure/LocalStorageAppSettings";
import { ExpectedPhotovoltaicPerformanceApi } from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceApi";
import HttpSaveExpressReconversionProjectService from "@/features/create-project/infrastructure/save-express-project-service/HttpSaveExpressReconversionProjectService";
import { HttpSaveReconversionProjectService } from "@/features/create-project/infrastructure/save-project-service/HttpSaveReconversionProjectService";
import { HttpSitesService } from "@/features/create-project/infrastructure/sites-service/HttpSiteService";
import { HttpCreateSiteApi } from "@/features/create-site/infrastructure/create-site-service/HttpCreateSiteApi";
import { HttpCreateUserService } from "@/features/onboarding/infrastructure/create-user-service/HttpCreateUserService";
import { HttpCurrentUserService } from "@/features/onboarding/infrastructure/current-user-service/HttpCurrentUserService";
import { HttpProjectFeaturesService } from "@/features/projects/infrastructure/project-features-service/HttpProjectFeaturesService";
import { HttpReconversionProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/HttpProjectsListApi";
import { HttpQuickUrbanProjectImpactsService } from "@/features/projects/infrastructure/quick-urban-project-impacts-service/HttpQuickUrbanProjectImpactsService";
import { HttpReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/HttpReconversionProjectImpactsService";
import { HttpSiteFeaturesService } from "@/features/site-features/infra/site-features-service/HttpSiteFeaturesService";
import { CreateFeatureAlertService } from "@/features/user-feature-alerts/infrastructure/create-feature-alert-service/CreateFeatureAlertService";
import { AdministrativeDivisionGeoApi } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionGeoApi";
import { SoilsCarbonStorageApi } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";

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
  currentUserService: new HttpCurrentUserService(),
  createUserService: new HttpCreateUserService(),
  createUserFeatureAlertService: new CreateFeatureAlertService(),
  siteFeaturesService: new HttpSiteFeaturesService(),
  projectFeaturesService: new HttpProjectFeaturesService(),
  quickUrbanProjectImpactsService: new HttpQuickUrbanProjectImpactsService(),
};
