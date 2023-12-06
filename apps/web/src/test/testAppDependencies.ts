import { LocalStorageGetSiteApi } from "@/features/create-project/infrastructure/get-site-service/localStorageGetSiteService";
import { LocalStorageSaveProjectApi } from "@/features/create-project/infrastructure/save-project-service/localStorageSaveSiteService";
import { LocalStorageCreateSiteApi } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { LocalStorageProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
import { LocalStorageSitesApi } from "@/features/projects/infrastructure/sites-service/localStorageSitesApi";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { AppDependencies } from "@/store";

export const getTestAppDependencies = (
  depsOverride: Partial<AppDependencies> = {},
): AppDependencies => {
  return {
    soilsCarbonStorageService: new SoilsCarbonStorageMock({
      soilsStorage: [],
      totalCarbonStorage: 0,
    }),
    createSiteService: new LocalStorageCreateSiteApi(),
    getSiteService: new LocalStorageGetSiteApi(),
    projectsListService: new LocalStorageProjectsListApi(),
    saveProjectGateway: new LocalStorageSaveProjectApi(),
    sitesService: new LocalStorageSitesApi(),
    ...depsOverride,
  };
};
