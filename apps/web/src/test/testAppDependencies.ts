import { InMemoryAppSettings } from "@/features/app-settings/infrastructure/InMemoryAppSettings";
import {
  ExpectedPhotovoltaicPerformanceMock,
  MOCK_RESULT,
} from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceMock";
import { InMemorySaveExpressReconversionProjectService } from "@/features/create-project/infrastructure/save-express-project-service/InMemorySaveExpressReconversionProjectService";
import { InMemorySaveReconversionProjectService } from "@/features/create-project/infrastructure/save-project-service/InMemorySaveReconversionProjectService";
import { SitesServiceMock } from "@/features/create-project/infrastructure/sites-service/SitesServiceMock";
import { InMemoryCreateSiteService } from "@/features/create-site/infrastructure/create-site-service/inMemoryCreateSiteApi";
import { InMemoryCreateUserService } from "@/features/onboarding/infrastructure/create-user-service/inMemoryCreateUserService";
import { InMemoryCurrentUserService } from "@/features/onboarding/infrastructure/current-user-service/inMemoryCurrentUserService";
import { MockProjectFeaturesService } from "@/features/projects/infrastructure/project-features-service/MockProjectFeaturesService";
import { InMemoryReconversionProjectsListService } from "@/features/projects/infrastructure/projects-list-service/InMemoryProjectsListService";
import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";
import { MockSiteFeaturesService } from "@/features/site-features/infra/site-features-service/MockSiteFeaturesService";
import { AppDependencies } from "@/shared/core/store-config/store";
import { AdministrativeDivisionMock } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionMock";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";

export const getTestAppDependencies = (
  depsOverride: Partial<AppDependencies> = {},
): AppDependencies => {
  return {
    appSettingsService: new InMemoryAppSettings(),
    soilsCarbonStorageService: new SoilsCarbonStorageMock({
      soilsStorage: [],
      totalCarbonStorage: 0,
    }),
    createSiteService: new InMemoryCreateSiteService(),
    reconversionProjectsListService: new InMemoryReconversionProjectsListService([]),
    reconversionProjectImpacts: new MockReconversionProjectImpactsApi(),
    saveReconversionProjectService: new InMemorySaveReconversionProjectService(),
    getSiteByIdService: new SitesServiceMock(),
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
    siteFeaturesService: new MockSiteFeaturesService(),
    saveExpressReconversionProjectService: new InMemorySaveExpressReconversionProjectService(),
    projectFeaturesService: new MockProjectFeaturesService(),
    ...depsOverride,
  };
};
