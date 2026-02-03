import { InMemorySiteService } from "@/features/sites/infra/site-service/InMemorySiteService";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { fetchSiteView } from "../fetchSiteView.action";
import type { SiteGateway } from "../gateways/SiteGateway";
import type { SiteFeatures, SiteView } from "../site.types";
import { selectSitePageViewModel } from "../siteView.reducer";

const createMockSiteView = (overrides: Partial<SiteView> = {}): SiteView => ({
  id: "site-123",
  features: {
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
  },
  actions: [],
  reconversionProjects: [],
  compatibilityEvaluation: null,
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

describe("siteView reducer", () => {
  describe("fetchSiteView action", () => {
    it("sets loading state and then success state with data when fetch succeeds", async () => {
      const siteId = "site-123";
      const mockSiteView = createMockSiteView({ id: siteId });

      const siteService = new InMemorySiteService();
      siteService.setSiteView(mockSiteView);
      const store = createStore(getTestAppDependencies({ siteService }));

      const fetchPromise = store.dispatch(fetchSiteView({ siteId }));

      // During fetch, state should be loading
      expect(store.getState().siteView.byId[siteId]?.loadingState).toBe("loading");

      await fetchPromise;

      expect(store.getState().siteView.byId[siteId]).toEqual({
        loadingState: "success",
        data: mockSiteView,
      });
    });

    it("sets error state when fetch fails", async () => {
      const siteId = "site-456";

      const store = createStore(
        getTestAppDependencies({
          siteService: new InMemorySiteServiceWithError(),
        }),
      );

      await store.dispatch(fetchSiteView({ siteId }));

      expect(store.getState().siteView.byId[siteId]).toEqual({
        loadingState: "error",
        data: undefined,
      });
    });

    it("can fetch multiple sites independently", async () => {
      const siteView1 = createMockSiteView({ id: "site-1" });
      const siteView2 = createMockSiteView({ id: "site-2" });

      const siteService = new InMemorySiteService();
      const store = createStore(getTestAppDependencies({ siteService }));

      siteService.setSiteView(siteView1);
      await store.dispatch(fetchSiteView({ siteId: "site-1" }));

      siteService.setSiteView(siteView2);
      await store.dispatch(fetchSiteView({ siteId: "site-2" }));

      const state = store.getState().siteView;
      expect(state.byId["site-1"]).toEqual({
        loadingState: "success",
        data: siteView1,
      });
      expect(state.byId["site-2"]).toEqual({
        loadingState: "success",
        data: siteView2,
      });
    });
  });

  describe("selectSitePageViewModel", () => {
    it("returns idle state when site has not been fetched", () => {
      const store = createStore(getTestAppDependencies());

      const viewModel = selectSitePageViewModel(store.getState(), "unknown-site");

      expect(viewModel).toEqual({
        loadingState: "idle",
        siteView: undefined,
      });
    });

    it("returns loading state when site is being fetched", async () => {
      const siteId = "site-loading";
      const store = createStore(getTestAppDependencies());

      const fetchPromise = store.dispatch(fetchSiteView({ siteId }));

      const viewModel = selectSitePageViewModel(store.getState(), siteId);
      expect(viewModel).toEqual({
        loadingState: "loading",
        siteView: undefined,
      });

      await fetchPromise;
    });

    it("returns success state with siteView when fetch succeeds", async () => {
      const siteId = "site-success";
      const mockSiteView = createMockSiteView({ id: siteId });

      const siteService = new InMemorySiteService();
      siteService.setSiteView(mockSiteView);
      const store = createStore(getTestAppDependencies({ siteService }));

      await store.dispatch(fetchSiteView({ siteId }));

      const viewModel = selectSitePageViewModel(store.getState(), siteId);
      expect(viewModel).toEqual({
        loadingState: "success",
        siteView: mockSiteView,
      });
    });

    it("returns error state when fetch fails", async () => {
      const siteId = "site-error";

      const store = createStore(
        getTestAppDependencies({
          siteService: new InMemorySiteServiceWithError(),
        }),
      );

      await store.dispatch(fetchSiteView({ siteId }));

      const viewModel = selectSitePageViewModel(store.getState(), siteId);
      expect(viewModel).toEqual({
        loadingState: "error",
        siteView: undefined,
      });
    });
  });
});
