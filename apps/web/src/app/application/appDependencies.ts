import { AppDependencies } from "./store";

import { ExpectedPhotovoltaicPerformanceApi } from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceApi";
import HttpSaveExpressReconversionProjectService from "@/features/create-project/infrastructure/save-express-project-service/HttpSaveExpressReconversionProjectService";
import { HttpSaveReconversionProjectService } from "@/features/create-project/infrastructure/save-project-service/HttpSaveReconversionProjectService";
import { HttpSitesService } from "@/features/create-project/infrastructure/sites-service/HttpSiteService";
import { HttpCreateSiteApi } from "@/features/create-site/infrastructure/create-site-service/HttpCreateSiteApi";
import { LocalStorageProjectDetailsApi } from "@/features/projects/infrastructure/project-details-service/localStorageProjectDetailsApi";
import { HttpProjectFeaturesService } from "@/features/projects/infrastructure/project-features-service/HttpProjectFeaturesService";
import { HttpReconversionProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/HttpProjectsListApi";
import { HttpReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/HttpReconversionProjectImpactsService";
import { HttpSiteFeaturesService } from "@/features/site-features/infra/site-features-service/HttpSiteFeaturesService";
import { HttpCreateUserService } from "@/features/users/infra/create-user-service/HttpCreateUserService";
import { LocalStorageUserService } from "@/features/users/infra/current-user-service/LocalStorageUserService";
import { AdministrativeDivisionGeoApi } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionGeoApi";
import { SoilsCarbonStorageApi } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageApi";

export const appDependencies: AppDependencies = {
  soilsCarbonStorageService: new SoilsCarbonStorageApi(),
  createSiteService: new HttpCreateSiteApi(),
  getSiteByIdService: new HttpSitesService(),
  reconversionProjectsListService: new HttpReconversionProjectsListApi(),
  projectDetailsService: new LocalStorageProjectDetailsApi(),
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
