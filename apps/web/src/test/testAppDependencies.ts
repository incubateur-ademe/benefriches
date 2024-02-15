import { AppDependencies } from "@/app/application/store";
import {
  ExpectedPhotovoltaicPerformanceMock,
  MOCK_RESULT,
} from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceMock";
import { LocalStorageSaveProjectApi } from "@/features/create-project/infrastructure/save-project-service/localStorageSaveSiteService";
import { SitesServiceMock } from "@/features/create-project/infrastructure/sites-service/SitesServiceMock";
import { InMemoryCreateSiteService } from "@/features/create-site/infrastructure/create-site-service/inMemoryCreateSiteApi";
import { LocalStorageProjectDetailsApi } from "@/features/projects/infrastructure/project-details-service/localStorageProjectDetailsApi";
import { LocalStorageProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
import { LocalStorageSitesApi } from "@/features/projects/infrastructure/sites-service/localStorageSitesApi";
import { LocalStorageUserService } from "@/features/users/infra/get-user-service/LocalStorageUserService";
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
    projectsListService: new LocalStorageProjectsListApi(),
    projectDetailsService: new LocalStorageProjectDetailsApi(),
    saveProjectGateway: new LocalStorageSaveProjectApi(),
    sitesService: new LocalStorageSitesApi(),
    getSiteByIdService: new SitesServiceMock(),
    photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceMock(MOCK_RESULT),
    userService: new LocalStorageUserService(),
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
