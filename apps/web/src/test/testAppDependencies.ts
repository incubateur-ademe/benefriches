import { AppDependencies } from "@/app/application/store";
import {
  ExpectedPhotovoltaicPerformanceMock,
  MOCK_RESULT,
} from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceMock";
import { LocalStorageSaveProjectApi } from "@/features/create-project/infrastructure/save-project-service/localStorageSaveSiteService";
import { SitesServiceMock } from "@/features/create-project/infrastructure/sites-service/SitesServiceMock";
import { InMemoryCreateSiteService } from "@/features/create-site/infrastructure/create-site-service/inMemoryCreateSiteApi";
import { LocalStorageProjectDetailsApi } from "@/features/projects/infrastructure/project-details-service/localStorageProjectDetailsApi";
import { InMemoryReconversionProjectsListService } from "@/features/projects/infrastructure/projects-list-service/InMemoryProjectsListService";
import { LocalStorageUserService } from "@/features/users/infra/get-user-service/LocalStorageUserService";
import { AdministrativeDivisionMock } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionMock";
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
    reconversionProjectsListService: new InMemoryReconversionProjectsListService([]),
    projectDetailsService: new LocalStorageProjectDetailsApi(),
    saveReconversionProjectService: new LocalStorageSaveProjectApi(),
    getSiteByIdService: new SitesServiceMock(),
    photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceMock(MOCK_RESULT),
    userService: new LocalStorageUserService(),
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
    ...depsOverride,
  };
};
