import { LocalStorageGetSiteApi } from "@/features/create-project/infrastructure/get-site-service/localStorageGetSiteService";
import { LocalStorageSaveProjectApi } from "@/features/create-project/infrastructure/save-project-service/localStorageSaveSiteService";
import { LocalStorageCreateSiteApi } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { SoilsCarbonStorageMock } from "@/features/create-site/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { LocalStorageProjectsListApi } from "@/features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
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
    ...depsOverride,
  };
};
