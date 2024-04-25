import {
  fetchCarbonStorageForSoils,
  GetSiteSoilsCarbonStoragePayload,
  SiteSoilsCarbonStorageResult,
} from "./siteSoilsCarbonStorage.actions";

import { createStore } from "@/app/application/store";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

describe("Site carbon sequestration reducer", () => {
  it("should get carbon sequestration for city code and soils", async () => {
    const mockedResult: SiteSoilsCarbonStorageResult = {
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
    const store = createStore(
      getTestAppDependencies({
        soilsCarbonStorageService: new SoilsCarbonStorageMock(mockedResult),
      }),
    );

    const siteInfo: GetSiteSoilsCarbonStoragePayload = {
      cityCode: "75011",
      soils: [
        { type: "BUILDINGS", surfaceArea: 1400 },
        { type: "MINERAL_SOIL", surfaceArea: 5000 },
      ],
    };
    await store.dispatch(fetchCarbonStorageForSoils(siteInfo));

    const state = store.getState();
    expect(state.siteCarbonStorage).toEqual({
      loadingState: "success",
      carbonStorage: {
        total: mockedResult.totalCarbonStorage,
        soils: mockedResult.soilsStorage,
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
      }),
    );

    const siteInfo: GetSiteSoilsCarbonStoragePayload = {
      cityCode: "75011",
      soils: [
        { type: "BUILDINGS", surfaceArea: 1400 },
        { type: "MINERAL_SOIL", surfaceArea: 5000 },
      ],
    };
    await store.dispatch(fetchCarbonStorageForSoils(siteInfo));

    const state = store.getState();
    expect(state.siteCarbonStorage).toEqual({
      loadingState: "error",
      carbonStorage: undefined,
    });
  });
});
