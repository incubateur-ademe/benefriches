/* eslint-disable @typescript-eslint/unbound-method */
import { SoilsDistribution } from "shared";
import { ProjectSite } from "../domain/project.types";
import { getInitialState as getProjectCreationInitialState } from "./createProject.reducer";
import {
  fetchCurrentAndProjectedSoilsCarbonStorage,
  SoilsCarbonStorageResult,
} from "./soilsCarbonStorage.actions";

import { createStore, RootState } from "@/app/application/store";
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

const SITE_MOCKED_RESULT = {
  id: "03a53ffd-4f71-419e-8d04-041311eefa23",
  isFriche: true,
  owner: { name: "", structureType: "company" },
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
    BUILDINGS: 1400,
    MINERAL_SOIL: 1500,
  },
} satisfies ProjectSite;

const PROJECT_SOILS_MOCK: SoilsDistribution = {
  BUILDINGS: 400,
  MINERAL_SOIL: 500,
  PRAIRIE_GRASS: 5500,
} as const;

const getPreloadedProjectCreationState = (): RootState["projectCreation"] => {
  const projectCreationDefaultInitialState = getProjectCreationInitialState();
  return {
    ...projectCreationDefaultInitialState,
    siteData: SITE_MOCKED_RESULT,
    projectData: {
      ...projectCreationDefaultInitialState.projectData,
      soilsDistribution: PROJECT_SOILS_MOCK,
    },
  };
};

describe("Site carbon sequestration reducer", () => {
  it("should return error when there is no siteData nor projectData in createProject store", async () => {
    const store = createStore(
      getTestAppDependencies({
        soilsCarbonStorageService: new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT),
      }),
    );

    await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

    const state = store.getState();
    expect(state.projectSoilsCarbonStorage).toEqual({
      loadingState: "error",
      siteCarbonStorage: undefined,
      projectCarbonStorage: undefined,
    });
  });

  it("should call soils carbon service with the right payload", async () => {
    const soilsCarbonStorageMockSpy = new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT);
    jest.spyOn(soilsCarbonStorageMockSpy, "getForCityCodeAndSoils");
    const store = createStore(
      getTestAppDependencies({
        soilsCarbonStorageService: soilsCarbonStorageMockSpy,
      }),
      { projectCreation: getPreloadedProjectCreationState() },
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
        { surfaceArea: 5500, type: "PRAIRIE_GRASS" },
      ],
    });
  });

  it("should get carbon sequestration for city code and project and site soils", async () => {
    const store = createStore(
      getTestAppDependencies({
        soilsCarbonStorageService: new SoilsCarbonStorageMock(SOILS_STORAGE_API_MOCKED_RESULT),
      }),
      { projectCreation: getPreloadedProjectCreationState() },
    );

    await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

    const state = store.getState();
    expect(state.projectSoilsCarbonStorage).toEqual({
      loadingState: "success",
      current: SOILS_STORAGE_API_MOCKED_RESULT,
      projected: SOILS_STORAGE_API_MOCKED_RESULT,
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
      }),
      { projectCreation: getPreloadedProjectCreationState() },
    );

    await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

    const state = store.getState();
    expect(state.projectSoilsCarbonStorage).toEqual({
      loadingState: "error",
      siteCarbonStorage: undefined,
      projectCarbonStorage: undefined,
    });
  });
});
