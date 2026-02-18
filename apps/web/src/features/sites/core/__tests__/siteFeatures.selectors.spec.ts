import type { RootState } from "@/shared/core/store-config/store";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectSiteFeaturesViewData } from "../siteFeatures.selectors";

describe("siteFeatures ViewData selectors", () => {
  describe("selectSiteFeaturesViewData", () => {
    it("returns site features and loading state", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const state = {
        ...defaultState,
        siteFeatures: {
          dataLoadingState: "success",
          siteData: {
            id: "site-123",
            name: "Mon Site",
            nature: "FRICHE",
            isExpressSite: false,
            fricheActivity: "INDUSTRY",
            surfaceArea: 15000,
            soilsDistribution: {
              BUILDINGS: 5000,
              IMPERMEABLE_SOILS: 10000,
            },
            address: "Grenoble, 38100",
            ownerName: "Propriétaire SA",
            accidents: {},
            expenses: [],
            incomes: [],
          },
        },
      } satisfies RootState;

      const viewData = selectSiteFeaturesViewData(state);

      expect(viewData).toEqual({
        loadingState: "success",
        siteFeatures: {
          id: "site-123",
          name: "Mon Site",
          nature: "FRICHE",
          isExpressSite: false,
          fricheActivity: "INDUSTRY",
          surfaceArea: 15000,
          soilsDistribution: {
            BUILDINGS: 5000,
            IMPERMEABLE_SOILS: 10000,
          },
          address: "Grenoble, 38100",
          ownerName: "Propriétaire SA",
          accidents: {},
          expenses: [],
          incomes: [],
        },
      });
    });

    it("returns undefined site features when loading", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const state = {
        ...defaultState,
        siteFeatures: {
          dataLoadingState: "loading",
          siteData: undefined,
        },
      } satisfies RootState;

      const viewData = selectSiteFeaturesViewData(state);

      expect(viewData).toEqual({
        loadingState: "loading",
        siteFeatures: undefined,
      });
    });
  });
});
