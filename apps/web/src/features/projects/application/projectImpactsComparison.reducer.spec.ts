/* eslint-disable @typescript-eslint/unbound-method */
import { ProjectDetailsServiceMock } from "../infrastructure/project-details-service/projectDetailsServiceMock";
import {
  fetchBaseProjectAndWithProjectData,
  fetchCurrentAndProjectedSoilsCarbonStorage,
} from "./projectImpactsComparison.actions";

import { SoilType } from "@/shared/domain/soils";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { createStore } from "@/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

const SOILS_STORAGE_API_MOCKED_RESULT = {
  totalCarbonStorage: 350,
  soilsStorage: [
    { type: SoilType.BUILDINGS, carbonStorage: 30, surfaceArea: 1400 },
    { type: SoilType.MINERAL_SOIL, carbonStorage: 320, surfaceArea: 5000 },
  ],
};

const PROJECT_MOCKED_RESULT = {
  id: "4343b02e-d066-437c-b626-4fbd1ef2ed18",
  name: "Centrale photovoltaique",
  relatedSiteId: "03a53ffd-4f71-419e-8d04-041311eefa23",
  soilsSurfaceAreas: {
    [SoilType.BUILDINGS]: 400,
    [SoilType.MINERAL_SOIL]: 500,
    [SoilType.PRAIRIE_GRASS]: 2000,
  },
};

const SITE_MOCKED_RESULT = {
  id: "03a53ffd-4f71-419e-8d04-041311eefa23",
  isFriche: true,
  owner: { name: "", structureType: "unknown" },
  name: "Friche industrielle",
  surfaceArea: 2900,
  hasContaminatedSoils: false,
  address: {
    lat: 2.347,
    long: 48.859,
    city: "Paris",
    id: "75110_7043",
    cityCode: "75110",
    postCode: "75010",
    value: "Rue de Paradis 75010 Paris",
  },
  soilsSurfaceAreas: {
    [SoilType.BUILDINGS]: 1400,
    [SoilType.MINERAL_SOIL]: 1500,
  },
};

const OTHER_PROJECT_ID = "a2c1a172-4ee3-4c76-8367-5519ca73ea2a";

describe("Project impacts comparison reducer", () => {
  describe("Project impacts comparison reducer: fetchBaseProjectAndWithProjectData", () => {
    it("should return error when service fails", async () => {
      const store = createStore(
        getTestAppDependencies({
          projectDetailsService: new ProjectDetailsServiceMock(
            // @ts-expect-error intended failure
            null,
            true,
          ),
        }),
      );

      await store.dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId: PROJECT_MOCKED_RESULT["id"],
          withProject: "STATU_QUO",
        }),
      );

      const state = store.getState();
      expect(state.projectImpactsComparison).toEqual({
        dataLoadingState: "error",
        projectData: undefined,
        siteData: undefined,
        baseProjectId: undefined,
        withProject: undefined,
        otherProjectData: undefined,
        carbonStorageDataLoadingState: "idle",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
      });
    });

    it("should fetch and assign project and site data in projectImpactsComparison store", async () => {
      const store = createStore(
        getTestAppDependencies({
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId: PROJECT_MOCKED_RESULT["id"],
          withProject: "STATU_QUO",
        }),
      );

      const state = store.getState();
      expect(state.projectImpactsComparison).toEqual({
        dataLoadingState: "success",
        baseProjectId: PROJECT_MOCKED_RESULT["id"],
        withProject: "STATU_QUO",
        projectData: PROJECT_MOCKED_RESULT,
        siteData: SITE_MOCKED_RESULT,
        carbonStorageDataLoadingState: "idle",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
      });
    });

    it("should fetch and assign project, site data and other project data in projectImpactsComparison store", async () => {
      const store = createStore(
        getTestAppDependencies({
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId: PROJECT_MOCKED_RESULT["id"],
          withProject: OTHER_PROJECT_ID,
        }),
      );

      const state = store.getState();
      expect(state.projectImpactsComparison).toEqual({
        dataLoadingState: "success",
        baseProjectId: PROJECT_MOCKED_RESULT["id"],
        withProject: OTHER_PROJECT_ID,
        projectData: PROJECT_MOCKED_RESULT,
        otherProjectData: PROJECT_MOCKED_RESULT,
        siteData: SITE_MOCKED_RESULT,
        carbonStorageDataLoadingState: "idle",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
      });
    });
  });

  describe("Project impacts comparison reducer: fetchCurrentAndProjectedSoilsCarbonStorage", () => {
    it("should return error when there is no siteData nor projectData in projectImpactsComparison store", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(
            SOILS_STORAGE_API_MOCKED_RESULT,
          ),
        }),
      );

      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectImpactsComparison).toEqual({
        carbonStorageDataLoadingState: "error",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
        baseProjectId: undefined,
        dataLoadingState: "idle",
        otherProjectData: undefined,
        projectData: undefined,
        siteData: undefined,
        withProject: undefined,
      });
    });

    it("should call soils carbon service with the right payload for statu_quo comparaison", async () => {
      const soilsCarbonStorageMockSpy = new SoilsCarbonStorageMock(
        SOILS_STORAGE_API_MOCKED_RESULT,
      );
      jest.spyOn(soilsCarbonStorageMockSpy, "getForCityCodeAndSoils");
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: soilsCarbonStorageMockSpy,
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId: PROJECT_MOCKED_RESULT["id"],
          withProject: "STATU_QUO",
        }),
      );
      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      expect(
        soilsCarbonStorageMockSpy.getForCityCodeAndSoils,
      ).toHaveBeenCalledTimes(2);
      expect(
        soilsCarbonStorageMockSpy.getForCityCodeAndSoils,
      ).toHaveBeenCalledWith({
        cityCode: "75110",
        soils: [
          { surfaceArea: 1400, type: "BUILDINGS" },
          { surfaceArea: 1500, type: "MINERAL_SOIL" },
        ],
      });
      expect(
        soilsCarbonStorageMockSpy.getForCityCodeAndSoils,
      ).toHaveBeenCalledWith({
        cityCode: "75110",
        soils: [
          { surfaceArea: 400, type: "BUILDINGS" },
          { surfaceArea: 500, type: "MINERAL_SOIL" },
          { surfaceArea: 2000, type: "PRAIRIE_GRASS" },
        ],
      });
    });

    it("should call soils carbon service with the right payload for projects comparaison", async () => {
      const soilsCarbonStorageMockSpy = new SoilsCarbonStorageMock(
        SOILS_STORAGE_API_MOCKED_RESULT,
      );
      jest.spyOn(soilsCarbonStorageMockSpy, "getForCityCodeAndSoils");
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: soilsCarbonStorageMockSpy,
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId: PROJECT_MOCKED_RESULT["id"],
          withProject: OTHER_PROJECT_ID,
        }),
      );
      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      expect(
        soilsCarbonStorageMockSpy.getForCityCodeAndSoils,
      ).toHaveBeenNthCalledWith(1, {
        cityCode: "75110",
        soils: [
          { surfaceArea: 400, type: "BUILDINGS" },
          { surfaceArea: 500, type: "MINERAL_SOIL" },
          { surfaceArea: 2000, type: "PRAIRIE_GRASS" },
        ],
      });
      expect(
        soilsCarbonStorageMockSpy.getForCityCodeAndSoils,
      ).toHaveBeenNthCalledWith(2, {
        cityCode: "75110",
        soils: [
          { surfaceArea: 400, type: "BUILDINGS" },
          { surfaceArea: 500, type: "MINERAL_SOIL" },
          { surfaceArea: 2000, type: "PRAIRIE_GRASS" },
        ],
      });
    });

    it("should get carbon sequestration for project and statu quo", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(
            SOILS_STORAGE_API_MOCKED_RESULT,
          ),
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId: PROJECT_MOCKED_RESULT["id"],
          withProject: "STATU_QUO",
        }),
      );
      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectImpactsComparison).toEqual({
        dataLoadingState: "success",
        baseProjectId: PROJECT_MOCKED_RESULT["id"],
        withProject: "STATU_QUO",
        projectData: PROJECT_MOCKED_RESULT,
        otherProjectData: undefined,
        siteData: SITE_MOCKED_RESULT,
        carbonStorageDataLoadingState: "success",
        currentCarbonStorage: SOILS_STORAGE_API_MOCKED_RESULT,
        projectedCarbonStorage: SOILS_STORAGE_API_MOCKED_RESULT,
      });
    });

    it("should get carbon sequestration for project and another project", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(
            SOILS_STORAGE_API_MOCKED_RESULT,
          ),
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId: PROJECT_MOCKED_RESULT["id"],
          withProject: OTHER_PROJECT_ID,
        }),
      );
      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectImpactsComparison).toEqual({
        dataLoadingState: "success",
        baseProjectId: PROJECT_MOCKED_RESULT["id"],
        withProject: OTHER_PROJECT_ID,
        projectData: PROJECT_MOCKED_RESULT,
        otherProjectData: PROJECT_MOCKED_RESULT,
        siteData: SITE_MOCKED_RESULT,
        carbonStorageDataLoadingState: "success",
        currentCarbonStorage: SOILS_STORAGE_API_MOCKED_RESULT,
        projectedCarbonStorage: SOILS_STORAGE_API_MOCKED_RESULT,
      });
    });

    it("should return error state when service fails", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(
            // @ts-expect-error intended failure
            null,
            true,
          ),
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId: PROJECT_MOCKED_RESULT["id"],
          withProject: "STATU_QUO",
        }),
      );
      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectImpactsComparison).toEqual({
        carbonStorageDataLoadingState: "error",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
        baseProjectId: PROJECT_MOCKED_RESULT["id"],
        dataLoadingState: "success",
        otherProjectData: undefined,
        projectData: PROJECT_MOCKED_RESULT,
        siteData: SITE_MOCKED_RESULT,
        withProject: "STATU_QUO",
      });
    });
  });
});
