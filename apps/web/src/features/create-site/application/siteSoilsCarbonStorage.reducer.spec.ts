import { SoilType } from "../domain/siteFoncier.types";
import { LocalStorageCreateSiteApi } from "../infrastructure/create-site-service/localStorageCreateSiteApi";
import { SoilsCarbonStorageMock } from "../infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { fetchCarbonStorageForSoils } from "./siteSoilsCarbonStorage.actions";

import { LocalStorageGetSiteApi } from "@/features/create-project/infrastructure/get-site-service/localStorageGetSiteService";
import { createStore } from "@/store";

describe("Site carbon sequestration reducer", () => {
  it("should get carbon sequestration for city code and soils", async () => {
    const mockedResult = {
      totalCarbonStorage: 350,
      soilsStorage: [
        { type: SoilType.BUILDINGS, carbonStorage: 30, surfaceArea: 1400 },
        { type: SoilType.MINERAL_SOIL, carbonStorage: 320, surfaceArea: 5000 },
      ],
    };
    const store = createStore({
      soilsCarbonStorageService: new SoilsCarbonStorageMock(mockedResult),
      createSiteService: new LocalStorageCreateSiteApi(),
      getSiteService: new LocalStorageGetSiteApi(),
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
      createSiteService: new LocalStorageCreateSiteApi(),
      getSiteService: new LocalStorageGetSiteApi(),
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
