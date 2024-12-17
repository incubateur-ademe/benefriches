import { AppDependencies } from "@/app/application/store";
import {
  ExpectedPhotovoltaicPerformanceMock,
  MOCK_RESULT,
} from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceMock";
import { InMemorySaveExpressReconversionProjectService } from "@/features/create-project/infrastructure/save-express-project-service/InMemorySaveExpressReconversionProjectService";
import { InMemorySaveReconversionProjectService } from "@/features/create-project/infrastructure/save-project-service/InMemorySaveReconversionProjectService";
import { SitesServiceMock } from "@/features/create-project/infrastructure/sites-service/SitesServiceMock";
import { InMemoryCreateSiteService } from "@/features/create-site/infrastructure/create-site-service/inMemoryCreateSiteApi";
import { MockProjectFeaturesService } from "@/features/projects/infrastructure/project-features-service/MockProjectFeaturesService";
import { InMemoryReconversionProjectsListService } from "@/features/projects/infrastructure/projects-list-service/InMemoryProjectsListService";
import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";
import { MockSiteFeaturesService } from "@/features/site-features/infra/site-features-service/MockSiteFeaturesService";
import { InMemoryAppSettings } from "@/shared/app-settings/infrastructure/InMemoryAppSettings";
import { AdministrativeDivisionMock } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionMock";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { InMemoryCreateUserService } from "@/users/infra/create-user-service/inMemoryCreateUserService";
import { InMemoryCurrentUserService } from "@/users/infra/current-user-service/inMemoryCurrentUserService";

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
