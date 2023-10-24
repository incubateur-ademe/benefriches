import { SoilType } from "../domain/siteFoncier.types";
import { SoilsCarbonSequestrationMock } from "../infrastructure/soils-carbon-storage-service/soilsCarbonSequestrationMock";
import { fetchCarbonSequestrationForSoils } from "./siteSoilsCarbonSequestration.actions";

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
      soilsCarbonSequestrationService: new SoilsCarbonSequestrationMock(
        mockedResult,
      ),
    });

    const siteInfo = {
      cityCode: "75011",
      soils: {
        [SoilType.BUILDINGS]: 1400,
        [SoilType.MINERAL_SOIL]: 5000,
      },
    };
    await store.dispatch(fetchCarbonSequestrationForSoils(siteInfo));

    const state = store.getState();
    expect(state.siteCarbonSequestration).toEqual({
      loadingState: "success",
      carbonSequestration: mockedResult,
    });
  });

  it("should return error state when service fails", async () => {
    const store = createStore({
      soilsCarbonSequestrationService: new SoilsCarbonSequestrationMock(
        // @ts-expect-error intended failure
        null,
        true,
      ),
    });

    const siteInfo = {
      cityCode: "75011",
      soils: {
        [SoilType.BUILDINGS]: 1400,
        [SoilType.MINERAL_SOIL]: 5000,
      },
    };
    await store.dispatch(fetchCarbonSequestrationForSoils(siteInfo));

    const state = store.getState();
    expect(state.siteCarbonSequestration).toEqual({
      loadingState: "error",
      carbonSequestration: undefined,
    });
  });
});
