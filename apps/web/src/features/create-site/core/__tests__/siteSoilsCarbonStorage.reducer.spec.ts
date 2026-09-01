import { Address } from "shared";

import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";

import {
  fetchSiteSoilsCarbonStorage,
  SiteSoilsCarbonStorageResult,
} from "../actions/siteSoilsCarbonStorage.actions";
import { selectSiteSoilsCarbonStorageViewData } from "../siteSoilsCarbonStorage.reducer";
import { StoreBuilder } from "./creation-steps/testUtils";

describe("Site carbon sequestration reducer", () => {
  it("should get carbon sequestration for site city code and soils distribution", async () => {
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

    const address: Address = {
      lat: 5.7243,
      long: 45.182081,
      city: "Grenoble",
      banId: "38185",
      cityCode: "38185",
      postCode: "38100",
      value: "Grenoble",
    };
    const store = new StoreBuilder()
      .withAppDependencies({
        soilsCarbonStorageService: new SoilsCarbonStorageMock(mockedResult),
      })
      .withCreationData({
        address,
        soilsDistribution: {
          BUILDINGS: 1400,
          MINERAL_SOIL: 5000,
        },
      })
      .build();

    await store.dispatch(fetchSiteSoilsCarbonStorage());

    const state = store.getState();
    expect(state.siteCarbonStorage).toEqual({
      loadingState: "success",
      cityCode: "38185",
      carbonStorage: {
        total: mockedResult.totalCarbonStorage,
        soils: mockedResult.soilsStorage,
      },
    });
  });

  it("should return error state when service fails", async () => {
    const store = new StoreBuilder()
      .withAppDependencies({
        soilsCarbonStorageService: new SoilsCarbonStorageMock(
          // @ts-expect-error intended failure
          null,
          true,
        ),
      })
      .build();

    await store.dispatch(fetchSiteSoilsCarbonStorage());

    const state = store.getState();
    expect(state.siteCarbonStorage).toEqual({
      loadingState: "error",
      carbonStorage: undefined,
      cityCode: undefined,
    });
  });
});

describe("selectSiteSoilsCarbonStorageViewData", () => {
  it("hides the fetched carbon storage once the site address has moved to another city", async () => {
    const mockedResult: SiteSoilsCarbonStorageResult = {
      totalCarbonStorage: 350,
      soilsStorage: [
        {
          type: "BUILDINGS",
          carbonStorage: 30,
          surfaceArea: 1400,
          carbonStorageInTonPerSquareMeters: 0.021,
        },
      ],
    };

    const grenobleAddress: Address = {
      lat: 5.7243,
      long: 45.182081,
      city: "Grenoble",
      banId: "38185",
      cityCode: "38185",
      postCode: "38100",
      value: "Grenoble",
    };
    const store = new StoreBuilder()
      .withAppDependencies({
        soilsCarbonStorageService: new SoilsCarbonStorageMock(mockedResult),
      })
      .withCreationData({ address: grenobleAddress, soilsDistribution: { BUILDINGS: 1400 } })
      .build();

    await store.dispatch(fetchSiteSoilsCarbonStorage());

    // The address changes to another city after the fetch, without a new fetch happening yet.
    const parisAddress: Address = {
      lat: 2.347,
      long: 48.859,
      city: "Paris",
      banId: "75110_7043",
      cityCode: "75110",
      postCode: "75010",
      value: "Rue de Paradis 75010 Paris",
    };
    const stateWithNewAddress = {
      ...store.getState(),
      siteCreation: {
        ...store.getState().siteCreation,
        initialSiteData: {
          ...store.getState().siteCreation.initialSiteData,
          address: parisAddress,
        },
      },
    };

    const viewData = selectSiteSoilsCarbonStorageViewData(stateWithNewAddress);

    expect(viewData).toEqual({ loadingState: "success", carbonStorage: undefined });
  });
});
