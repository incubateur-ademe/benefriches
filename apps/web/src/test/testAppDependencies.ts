import { AppDependencies } from "@/app/application/store";
import { LocalStorageGetSiteApi } from "@/features/create-project/infrastructure/get-site-service/localStorageGetSiteService";
import {
  ExpectedPhotovoltaicPerformanceMock,
  MOCK_RESULT,
} from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceMock";
import { LocalStorageSaveProjectApi } from "@/features/create-project/infrastructure/save-project-service/localStorageSaveSiteService";
import { InMemoryCreateSiteService } from "@/features/create-site/infrastructure/create-site-service/inMemoryCreateSiteApi";
import { LocalStorageProjectDetailsApi } from "@/features/projects/infrastructure/project-details-service/localStorageProjectDetailsApi";
import { LocalStorageProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
import { LocalStorageSitesApi } from "@/features/projects/infrastructure/sites-service/localStorageSitesApi";
import { LocalAuthoritiesMock } from "@/shared/infrastructure/local-authorities-service/localAuthoritiesMock";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";

export const getTestAppDependencies = (
  depsOverride: Partial<AppDependencies> = {},
): AppDependencies => {
  return {
    soilsCarbonStorageService: new SoilsCarbonStorageMock({
      soilsStorage: [],
      totalCarbonStorage: 0,
    }),
    createSiteService: new InMemoryCreateSiteService(),
    getSiteService: new LocalStorageGetSiteApi(),
    projectsListService: new LocalStorageProjectsListApi(),
    projectDetailsService: new LocalStorageProjectDetailsApi(),
    saveProjectGateway: new LocalStorageSaveProjectApi(),
    sitesService: new LocalStorageSitesApi(),
    photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceMock(MOCK_RESULT),
    localAuthoritiesService: new LocalAuthoritiesMock({
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
    }),
    ...depsOverride,
  };
};
