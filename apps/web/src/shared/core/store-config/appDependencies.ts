import { LocalStorageAppSettings } from "@/features/app-settings/infrastructure/LocalStorageAppSettings";
import HttpCreateExpressReconversionProjectService from "@/features/create-project/infrastructure/create-express-project-service/HttpCreateExpressReconversionProjectService";
import { ExpectedPhotovoltaicPerformanceApi } from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceApi";
import { HttpSaveReconversionProjectService } from "@/features/create-project/infrastructure/save-project-service/HttpSaveReconversionProjectService";
import { HttpSitesService } from "@/features/create-project/infrastructure/sites-service/HttpSiteService";
import { HttpCreateSiteApi } from "@/features/create-site/infrastructure/create-site-service/HttpCreateSiteApi";
import { HttpSiteEvaluationApi } from "@/features/my-evaluations/infrastructure/projects-list-service/HttpSiteEvaluationApi";
import { HttpAuthService } from "@/features/onboarding/infrastructure/auth-service/HttpAuthService";
import { HttpCreateUserService } from "@/features/onboarding/infrastructure/create-user-service/HttpCreateUserService";
import { HttpCurrentUserService } from "@/features/onboarding/infrastructure/current-user-service/HttpCurrentUserService";
import { LocalStorageCurrentUserService } from "@/features/onboarding/infrastructure/current-user-service/LocalStorageCurrentUserService";
import { HttpProjectFeaturesService } from "@/features/projects/infrastructure/project-features-service/HttpProjectFeaturesService";
import { HttpQuickUrbanProjectImpactsService } from "@/features/projects/infrastructure/quick-urban-project-impacts-service/HttpQuickUrbanProjectImpactsService";
import { HttpReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/HttpReconversionProjectImpactsService";
import { HttpUrbanSprawlImpactsComparisonService } from "@/features/projects/infrastructure/urban-sprawl-impacts-comparison-service/HttpUrbanSprawlImpactsComparisonService";
import { HttpReconversionCompatibilityEvaluation } from "@/features/reconversion-compatibility/infra/reconversion-compatibility-evaluation/HttpReconversionCompatibilityEvaluation";
import { HttpSiteService } from "@/features/sites/infra/site-service/HttpSiteService";
import { HttpUpdateReconversionProjectService } from "@/features/update-project/infrastructure/update-project-service/HttpUpdateReconversionProjectService";
import { CreateFeatureAlertService } from "@/features/user-feature-alerts/infrastructure/create-feature-alert-service/CreateFeatureAlertService";
import { AdministrativeDivisionGeoApi } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionGeoApi";
import { SoilsCarbonStorageApi } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";
import { BENEFRICHES_ENV } from "@/shared/views/envVars";

import { AppDependencies } from "./store";

const currentUserService = BENEFRICHES_ENV.authEnabled
  ? new HttpCurrentUserService()
  : new LocalStorageCurrentUserService();

export const appDependencies: AppDependencies = {
  appSettingsService: new LocalStorageAppSettings(),
  authService: new HttpAuthService(),
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new HttpCreateSiteApi(),
  getSiteByIdService: new HttpSitesService(),
  siteEvaluationService: new HttpSiteEvaluationApi(),
  saveReconversionProjectService: new HttpSaveReconversionProjectService(),
  createExpressReconversionProjectService: new HttpCreateExpressReconversionProjectService(),
  reconversionProjectImpacts: new HttpReconversionProjectImpactsApi(),
  photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceApi(),
  municipalityDataService: new AdministrativeDivisionGeoApi(),
  currentUserService,
  createUserService: new HttpCreateUserService(),
  createUserFeatureAlertService: new CreateFeatureAlertService(),
  siteService: new HttpSiteService(),
  projectFeaturesService: new HttpProjectFeaturesService(),
  quickUrbanProjectImpactsService: new HttpQuickUrbanProjectImpactsService(),
  urbanSprawlImpactsComparisonService: new HttpUrbanSprawlImpactsComparisonService(),
  reconversionCompatibilityEvaluationService: new HttpReconversionCompatibilityEvaluation(),
  updateProjectService: new HttpUpdateReconversionProjectService(),
};
