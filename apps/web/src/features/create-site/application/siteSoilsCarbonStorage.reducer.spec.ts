import { SoilType } from "../domain/siteFoncier.types";
import { SoilsCarbonStorageMock } from "../infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { fetchCarbonStorageForSoils } from "./siteSoilsCarbonStorage.actions";

import { createStore } from "@/store";

describe("Site carbon sequestration reducer", () => {
  it("should get carbon sequestration for city code and soils", async () => {
    const mockedResult = {
      totalCarbonStorage: 350,
      soilsStorage: {
        [SoilType.BUILDINGS]: 30,
        [SoilType.MINERAL_SOIL]: 320,
      },
    };
    const store = createStore({
      soilsCarbonStorageService: new SoilsCarbonStorageMock(mockedResult),
    });

    const siteInfo = {
      cityCode: "75011",
      soils: [
        { type: SoilType.BUILDINGS, surfaceArea: 1400 },
        { type: SoilType.MINERAL_SOIL, surfaceArea: 5000 },
      ],
    };
    await store.dispatch(fetchCarbonStorageForSoils(siteInfo));

    const state = store.getState();
    expect(state.siteCarbonStorage).toEqual({
      loadingState: "success",
      carbonStorage: mockedResult,
    });
  });

  it("should return error state when service fails", async () => {
    const store = createStore({
      soilsCarbonStorageService: new SoilsCarbonStorageMock(
        // @ts-expect-error intended failure
        null,
        true,
      ),
    });

    const siteInfo = {
      cityCode: "75011",
      soils: [
        { type: SoilType.BUILDINGS, surfaceArea: 1400 },
        { type: SoilType.MINERAL_SOIL, surfaceArea: 5000 },
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
