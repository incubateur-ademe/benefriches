import { InMemoryAppSettings } from "@/features/app-settings/infrastructure/InMemoryAppSettings";
import { InMemoryCreateExpressReconversionProjectService } from "@/features/create-project/infrastructure/create-express-project-service/InMemoryCreateExpressReconversionProjectService";
import {
  ExpectedPhotovoltaicPerformanceMock,
  MOCK_RESULT,
} from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceMock";
import { InMemorySaveReconversionProjectService } from "@/features/create-project/infrastructure/save-project-service/InMemorySaveReconversionProjectService";
import { InMemorySitesService } from "@/features/create-project/infrastructure/sites-service/InMemorySitesService";
import { InMemoryCreateSiteService } from "@/features/create-site/infrastructure/create-site-service/inMemoryCreateSiteApi";
import { InMemorySiteEvaluationService } from "@/features/my-evaluations/infrastructure/projects-list-service/InMemorySiteEvaluationsService";
import FakeAuthService from "@/features/onboarding/infrastructure/auth-service/FakeAuthService";
import { InMemoryCreateUserService } from "@/features/onboarding/infrastructure/create-user-service/inMemoryCreateUserService";
import { InMemoryCurrentUserService } from "@/features/onboarding/infrastructure/current-user-service/inMemoryCurrentUserService";
import { MockProjectFeaturesService } from "@/features/projects/infrastructure/project-features-service/MockProjectFeaturesService";
import { MockQuickUrbanProjectImpactsService } from "@/features/projects/infrastructure/quick-urban-project-impacts-service/MockQuickUrbanProjectImpactsService";
import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";
import { MockUrbanSprawlImpactsComparisonService } from "@/features/projects/infrastructure/urban-sprawl-impacts-comparison-service/MockUrbanSprawlImpactsComparisonService";
import { InMemoryReconversionCompatibilityEvaluationService } from "@/features/reconversion-compatibility/infra/reconversion-compatibility-evaluation/InMemoryReconversionCompatibilityEvaluation";
import { InMemorySiteService } from "@/features/sites/infra/site-service/InMemorySiteService";
import { InMemoryUpdateReconversionProjectService } from "@/features/update-project/infrastructure/update-project-service/InMemoryUpdateReconversionProjectService";
import { InMemoryCreateFeatureAlertService } from "@/features/user-feature-alerts/infrastructure/create-feature-alert-service/InMemoryCreateFeatureAlertService";
import { AppDependencies } from "@/shared/core/store-config/store";
import { AdministrativeDivisionMock } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionMock";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";

export const getTestAppDependencies = (
  depsOverride: Partial<AppDependencies> = {},
): AppDependencies => {
  return {
    appSettingsService: new InMemoryAppSettings(),
    authService: new FakeAuthService(),
    soilsCarbonStorageService: new SoilsCarbonStorageMock({
      soilsStorage: [],
      totalCarbonStorage: 0,
    }),
    createSiteService: new InMemoryCreateSiteService(),
    siteEvaluationService: new InMemorySiteEvaluationService([]),
    reconversionProjectImpacts: new MockReconversionProjectImpactsApi(),
    saveReconversionProjectService: new InMemorySaveReconversionProjectService(),
    getSiteByIdService: new InMemorySitesService(),
    photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceMock(MOCK_RESULT),
    municipalityDataService: new AdministrativeDivisionMock({
      localAuthorities: {
        city: {
          code: "",
          name: "",
        },
        epci: {
          code: "",
          name: "",
        },
        department: {
          code: "",
          name: "",
        },
        region: {
          code: "",
          name: "",
        },
      },
      population: 0,
    }),
    currentUserService: new InMemoryCurrentUserService(),
    createUserService: new InMemoryCreateUserService(),
    createUserFeatureAlertService: new InMemoryCreateFeatureAlertService(),
    siteService: new InMemorySiteService(),
    createExpressReconversionProjectService: new InMemoryCreateExpressReconversionProjectService(),
    projectFeaturesService: new MockProjectFeaturesService(),
    quickUrbanProjectImpactsService: new MockQuickUrbanProjectImpactsService(),
    urbanSprawlImpactsComparisonService: new MockUrbanSprawlImpactsComparisonService(),
    reconversionCompatibilityEvaluationService:
      new InMemoryReconversionCompatibilityEvaluationService(),
    updateProjectService: new InMemoryUpdateReconversionProjectService(),
    ...depsOverride,
  };
};
