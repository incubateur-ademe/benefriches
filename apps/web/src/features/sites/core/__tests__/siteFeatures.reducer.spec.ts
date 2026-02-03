import { InMemorySiteService } from "@/features/sites/infra/site-service/InMemorySiteService";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { fetchSiteFeatures } from "../fetchSiteFeatures.action";
import type { SiteGateway } from "../gateways/SiteGateway";
import type { SiteFeatures, SiteView } from "../site.types";
import { selectSiteFeaturesViewData } from "../siteFeatures.selectors";

const createMockSiteFeatures = (overrides: Partial<SiteFeatures> = {}): SiteFeatures => ({
  id: "site-123",
  name: "Test Site",
  address: "1 rue de Test, 75001 Paris",
  nature: "FRICHE",
  isExpressSite: false,
  accidents: {},
  expenses: [],
  incomes: [],
  surfaceArea: 10000,
  ownerName: "Test Owner",
  soilsDistribution: { BUILDINGS: 5000, MINERAL_SOIL: 5000 },
  ...overrides,
});

class InMemorySiteServiceWithError implements SiteGateway {
  getSiteFeatures(): Promise<SiteFeatures> {
    return Promise.reject(new Error("Service error"));
  }
  getSiteView(): Promise<SiteView> {
    return Promise.reject(new Error("Service error"));
  }
}

describe("siteFeatures reducer", () => {
  describe("fetchSiteFeatures action", () => {
    it("sets loading state and then success with data when fetch succeeds", async () => {
      const siteId = "site-123";
      const mockSiteFeatures = createMockSiteFeatures({ id: siteId });

      const siteService = new InMemorySiteService();
      siteService.setSiteFeatures(mockSiteFeatures);
      const store = createStore(getTestAppDependencies({ siteService }));

      const fetchPromise = store.dispatch(fetchSiteFeatures({ siteId }));

      // During fetch, state should be loading
      expect(store.getState().siteFeatures.dataLoadingState).toBe("loading");

      await fetchPromise;

      expect(store.getState().siteFeatures).toEqual({
        dataLoadingState: "success",
        siteData: mockSiteFeatures,
      });
    });

    it("sets error state when fetch fails", async () => {
      const siteId = "site-456";

      const store = createStore(
        getTestAppDependencies({
          siteService: new InMemorySiteServiceWithError(),
        }),
      );

      await store.dispatch(fetchSiteFeatures({ siteId }));

      expect(store.getState().siteFeatures).toEqual({
        dataLoadingState: "error",
        siteData: undefined,
      });
    });

    it("replaces previous site data when fetching a new site", async () => {
      const siteFeatures1 = createMockSiteFeatures({ id: "site-1", name: "First Site" });
      const siteFeatures2 = createMockSiteFeatures({ id: "site-2", name: "Second Site" });

      const siteService = new InMemorySiteService();
      const store = createStore(getTestAppDependencies({ siteService }));

      // Fetch first site
      siteService.setSiteFeatures(siteFeatures1);
      await store.dispatch(fetchSiteFeatures({ siteId: "site-1" }));

      expect(store.getState().siteFeatures.siteData).toEqual(siteFeatures1);

      // Fetch second site - should replace first one
      siteService.setSiteFeatures(siteFeatures2);
      await store.dispatch(fetchSiteFeatures({ siteId: "site-2" }));

      expect(store.getState().siteFeatures.siteData).toEqual(siteFeatures2);
    });
  });

  describe("selectSiteFeaturesViewData", () => {
    it("returns idle state with undefined siteFeatures initially", () => {
      const store = createStore(getTestAppDependencies());

      const viewData = selectSiteFeaturesViewData(store.getState());

      expect(viewData).toEqual({
        loadingState: "idle",
        siteFeatures: undefined,
      });
    });

    it("returns loading state with undefined siteFeatures when site is being fetched", async () => {
      const siteId = "site-loading";
      const store = createStore(getTestAppDependencies());

      const fetchPromise = store.dispatch(fetchSiteFeatures({ siteId }));

      const viewData = selectSiteFeaturesViewData(store.getState());
      expect(viewData).toEqual({
        loadingState: "loading",
        siteFeatures: undefined,
      });

      await fetchPromise;
    });

    it("returns success state with siteFeatures when fetch succeeds", async () => {
      const siteId = "site-success";
      const mockSiteFeatures = createMockSiteFeatures({ id: siteId });

      const siteService = new InMemorySiteService();
      siteService.setSiteFeatures(mockSiteFeatures);
      const store = createStore(getTestAppDependencies({ siteService }));

      await store.dispatch(fetchSiteFeatures({ siteId }));

      const viewData = selectSiteFeaturesViewData(store.getState());
      expect(viewData).toEqual({
        loadingState: "success",
        siteFeatures: mockSiteFeatures,
      });
    });

    it("returns error state with undefined siteFeatures when fetch fails", async () => {
      const siteId = "site-error";

      const store = createStore(
        getTestAppDependencies({
          siteService: new InMemorySiteServiceWithError(),
        }),
      );

      await store.dispatch(fetchSiteFeatures({ siteId }));

      const viewData = selectSiteFeaturesViewData(store.getState());
      expect(viewData).toEqual({
        loadingState: "error",
        siteFeatures: undefined,
      });
    });
  });
});
