/* eslint-disable @typescript-eslint/unbound-method */
import { Owner, ProjectStakeholder } from "../domain/projects.types";
import { ProjectDetailsServiceMock } from "../infrastructure/project-details-service/projectDetailsServiceMock";
import { SoilsCarbonStorageResult } from "./fetchReconversionProjectCarbonStorageImpact.action";
import {
  fetchBaseProjectAndWithProjectData,
  fetchCurrentAndProjectedSoilsCarbonStorage,
} from "./projectImpactsComparison.actions";

import { createStore } from "@/app/application/store";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

const SOILS_STORAGE_API_MOCKED_RESULT: SoilsCarbonStorageResult = {
  totalCarbonStorage: 350,
  soilsStorage: [
    {
      type: "BUILDINGS",
      carbonStorage: 30,
      surfaceArea: 1400,
      carbonStorageInTonPerSquareMeters: 0.021,
    },
    {
      type: "MINERAL_SOIL",
      carbonStorage: 320,
      surfaceArea: 5000,
      carbonStorageInTonPerSquareMeters: 0.064,
    },
  ],
};

const PROJECT_MOCKED_RESULT = {
  id: "4343b02e-d066-437c-b626-4fbd1ef2ed18",
  name: "Centrale photovoltaique",
  relatedSiteId: "03a53ffd-4f71-419e-8d04-041311eefa23",
  soilsDistribution: {
    ["BUILDINGS"]: 400,
    ["MINERAL_SOIL"]: 500,
    ["PRAIRIE_GRASS"]: 2000,
  },
  futureOperator: {
    name: "Test",
    structureType: "company",
  } as ProjectStakeholder,
  photovoltaicPanelsInstallationCost: 150000,
  financialAssistanceRevenues: 50000,
  yearlyProjectedCosts: [],
  yearlyProjectedRevenues: [],
};

const SITE_MOCKED_RESULT = {
  id: "03a53ffd-4f71-419e-8d04-041311eefa23",
  isFriche: true,
  owner: { name: "", structureType: "company" } as Owner,
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
  soilsDistribution: {
    ["BUILDINGS"]: 1400,
    ["MINERAL_SOIL"]: 1500,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
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
        baseScenario: {
          id: undefined,
          type: undefined,
          projectData: undefined,
          siteData: undefined,
          soilsCarbonStorage: undefined,
        },
        withScenario: {
          id: undefined,
          type: undefined,
          projectData: undefined,
          siteData: undefined,
          soilsCarbonStorage: undefined,
        },
        carbonStorageDataLoadingState: "idle",
        dataLoadingState: "error",
      });
    });

    it("should fetch and assign project and site data in projectImpactsComparison store for statu quo situation", async () => {
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
        baseScenario: {
          id: SITE_MOCKED_RESULT["id"],
          type: "STATU_QUO",
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: undefined,
        },
        withScenario: {
          id: PROJECT_MOCKED_RESULT["id"],
          type: "PROJECT",
          projectData: PROJECT_MOCKED_RESULT,
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: undefined,
        },
        carbonStorageDataLoadingState: "idle",
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
        baseScenario: {
          id: PROJECT_MOCKED_RESULT["id"],
          type: "PROJECT",
          projectData: PROJECT_MOCKED_RESULT,
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: undefined,
        },
        withScenario: {
          id: OTHER_PROJECT_ID,
          type: "PROJECT",
          projectData: PROJECT_MOCKED_RESULT,
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: undefined,
        },
        carbonStorageDataLoadingState: "idle",
      });
    });
  });

  describe("Project impacts comparison reducer: fetchCurrentAndProjectedSoilsCarbonStorage", () => {
    it("should return error when there is no siteData nor projectData in projectImpactsComparison store", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT),
        }),
      );

      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectImpactsComparison).toEqual({
        baseScenario: {
          id: undefined,
          type: undefined,
          projectData: undefined,
          siteData: undefined,
          soilsCarbonStorage: undefined,
        },
        withScenario: {
          id: undefined,
          type: undefined,
          projectData: undefined,
          siteData: undefined,
          soilsCarbonStorage: undefined,
        },
        carbonStorageDataLoadingState: "error",
        dataLoadingState: "idle",
      });
    });

    it("should call soils carbon service with the right payload for statu_quo comparaison", async () => {
      const soilsCarbonStorageMockSpy = new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT);
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

      expect(soilsCarbonStorageMockSpy.getForCityCodeAndSoils).toHaveBeenCalledTimes(2);
      expect(soilsCarbonStorageMockSpy.getForCityCodeAndSoils).toHaveBeenCalledWith({
        cityCode: "75110",
        soils: [
          { surfaceArea: 1400, type: "BUILDINGS" },
          { surfaceArea: 1500, type: "MINERAL_SOIL" },
        ],
      });
      expect(soilsCarbonStorageMockSpy.getForCityCodeAndSoils).toHaveBeenCalledWith({
        cityCode: "75110",
        soils: [
          { surfaceArea: 400, type: "BUILDINGS" },
          { surfaceArea: 500, type: "MINERAL_SOIL" },
          { surfaceArea: 2000, type: "PRAIRIE_GRASS" },
        ],
      });
    });

    it("should call soils carbon service with the right payload for projects comparaison", async () => {
      const soilsCarbonStorageMockSpy = new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT);
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

      expect(soilsCarbonStorageMockSpy.getForCityCodeAndSoils).toHaveBeenNthCalledWith(1, {
        cityCode: "75110",
        soils: [
          { surfaceArea: 400, type: "BUILDINGS" },
          { surfaceArea: 500, type: "MINERAL_SOIL" },
          { surfaceArea: 2000, type: "PRAIRIE_GRASS" },
        ],
      });
      expect(soilsCarbonStorageMockSpy.getForCityCodeAndSoils).toHaveBeenNthCalledWith(2, {
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
          soilsCarbonStorageService: new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT),
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
        carbonStorageDataLoadingState: "success",
        baseScenario: {
          id: SITE_MOCKED_RESULT["id"],
          type: "STATU_QUO",
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: SOILS_STORAGE_API_MOCKED_RESULT,
        },
        withScenario: {
          id: PROJECT_MOCKED_RESULT["id"],
          type: "PROJECT",
          projectData: PROJECT_MOCKED_RESULT,
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: SOILS_STORAGE_API_MOCKED_RESULT,
        },
      });
    });

    it("should get carbon sequestration for project and another project", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT),
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
        carbonStorageDataLoadingState: "success",

        baseScenario: {
          id: PROJECT_MOCKED_RESULT["id"],
          type: "PROJECT",
          projectData: PROJECT_MOCKED_RESULT,
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: SOILS_STORAGE_API_MOCKED_RESULT,
        },
        withScenario: {
          id: OTHER_PROJECT_ID,
          type: "PROJECT",
          projectData: PROJECT_MOCKED_RESULT,
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: SOILS_STORAGE_API_MOCKED_RESULT,
        },
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
        dataLoadingState: "success",
        baseScenario: {
          id: SITE_MOCKED_RESULT["id"],
          type: "STATU_QUO",
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: undefined,
        },
        withScenario: {
          id: PROJECT_MOCKED_RESULT["id"],
          type: "PROJECT",
          projectData: PROJECT_MOCKED_RESULT,
          siteData: SITE_MOCKED_RESULT,
          soilsCarbonStorage: undefined,
        },
      });
    });
  });
});
