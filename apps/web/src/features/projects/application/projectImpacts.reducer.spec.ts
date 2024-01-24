/* eslint-disable @typescript-eslint/unbound-method */
import { Owner, ProjectStakeholder } from "../domain/projects.types";
import { ProjectDetailsServiceMock } from "../infrastructure/project-details-service/projectDetailsServiceMock";
import {
  fetchCurrentAndProjectedSoilsCarbonStorage,
  fetchProjectAndSiteData,
} from "./projectImpacts.actions";

import { createStore } from "@/app/application/store";
import { SoilType } from "@/shared/domain/soils";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

const SOILS_STORAGE_API_MOCKED_RESULT = {
  totalCarbonStorage: 350,
  soilsStorage: [
    {
      type: SoilType.BUILDINGS,
      carbonStorage: 30,
      surfaceArea: 1400,
      carbonStorageInTonPerSquareMeters: 0.021,
    },
    {
      type: SoilType.MINERAL_SOIL,
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
    [SoilType.BUILDINGS]: 400,
    [SoilType.MINERAL_SOIL]: 500,
    [SoilType.PRAIRIE_GRASS]: 2000,
  },
  futureOperator: {
    name: "Test",
    structureType: "company",
  } as ProjectStakeholder,
  photovoltaicPanelsInstallationCost: 150000,
  financialAssistanceRevenue: 50000,
  yearlyProjectedCosts: [],
  yearlyProjectedRevenue: [],
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
    [SoilType.BUILDINGS]: 1400,
    [SoilType.MINERAL_SOIL]: 1500,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
};

describe("Project impacts reducer", () => {
  describe("Project impacts reducer: fetchProjectAndSiteData", () => {
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

      await store.dispatch(fetchProjectAndSiteData(PROJECT_MOCKED_RESULT["id"]));

      const state = store.getState();
      expect(state.projectImpacts).toEqual({
        dataLoadingState: "error",
        projectData: undefined,
        siteData: undefined,
        carbonStorageDataLoadingState: "idle",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
      });
    });

    it("should fetch and assign project and site data in projectImpacts store", async () => {
      const store = createStore(
        getTestAppDependencies({
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(fetchProjectAndSiteData(PROJECT_MOCKED_RESULT["id"]));

      const state = store.getState();
      expect(state.projectImpacts).toEqual({
        dataLoadingState: "success",
        projectData: PROJECT_MOCKED_RESULT,
        siteData: SITE_MOCKED_RESULT,
        carbonStorageDataLoadingState: "idle",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
      });
    });
  });

  describe("Project impacts reducer: fetchCurrentAndProjectedSoilsCarbonStorage", () => {
    it("should return error when there is no siteData nor projectData in projectImpacts store", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT),
        }),
      );

      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectImpacts).toEqual({
        carbonStorageDataLoadingState: "error",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
        dataLoadingState: "idle",
        projectData: undefined,
        siteData: undefined,
      });
    });

    it("should call soils carbon service with the right payload", async () => {
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

      await store.dispatch(fetchProjectAndSiteData(PROJECT_MOCKED_RESULT["id"]));
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

    it("should get carbon sequestration for project and site", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT),
          projectDetailsService: new ProjectDetailsServiceMock({
            projectData: PROJECT_MOCKED_RESULT,
            siteData: SITE_MOCKED_RESULT,
          }),
        }),
      );

      await store.dispatch(fetchProjectAndSiteData(PROJECT_MOCKED_RESULT["id"]));
      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectImpacts).toEqual({
        dataLoadingState: "success",
        projectData: PROJECT_MOCKED_RESULT,
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

      await store.dispatch(fetchProjectAndSiteData(PROJECT_MOCKED_RESULT["id"]));
      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectImpacts).toEqual({
        carbonStorageDataLoadingState: "error",
        currentCarbonStorage: undefined,
        projectedCarbonStorage: undefined,
        dataLoadingState: "success",
        projectData: PROJECT_MOCKED_RESULT,
        siteData: SITE_MOCKED_RESULT,
      });
    });
  });
});
