import { InMemoryCreateSiteService } from "../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { saveSiteAction } from "./createSite.actions";
import { SiteCreationStep } from "./createSite.reducer";
import {
  fricheWithExhaustiveData,
  fricheWithMinimalData,
  siteWithExhaustiveData,
  siteWithMinimalData,
} from "./siteData.mock";

import { createStore, RootState } from "@/app/application/store";
import { buildUser } from "@/features/users/domain/user.mock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

describe("Create site reducer", () => {
  describe("saveSite action", () => {
    it("should be in error state when site data in store is not valid (missing name)", async () => {
      const siteData = { ...siteWithMinimalData, name: undefined };
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        step: SiteCreationStep.CREATION_CONFIRMATION,
        siteData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
        },
      });
      await store.dispatch(saveSiteAction());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        saveLoadingState: "error",
      });
    });

    it("should be in error state when no user id in store", async () => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        step: SiteCreationStep.CREATION_CONFIRMATION,
        siteData: siteWithMinimalData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
      });
      await store.dispatch(saveSiteAction());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        saveLoadingState: "error",
      });
    });

    it("should be in error state when createSiteService fails", async () => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        step: SiteCreationStep.CREATION_CONFIRMATION,
        siteData: siteWithMinimalData,
      };

      const shouldFail = true;
      const store = createStore(
        getTestAppDependencies({ createSiteService: new InMemoryCreateSiteService(shouldFail) }),
        { siteCreation: initialState, currentUser: { currentUser: buildUser() } },
      );
      await store.dispatch(saveSiteAction());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        saveLoadingState: "error",
      });
    });

    it.each([
      { siteData: siteWithMinimalData, dataType: "site with minimal data" },
      { siteData: siteWithExhaustiveData, dataType: "site with exhaustive data" },
      { siteData: fricheWithMinimalData, dataType: "friche with minimal data" },
      { siteData: fricheWithExhaustiveData, dataType: "friche with exhaustive data" },
    ])("should be in success state when saving $dataType", async ({ siteData }) => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        step: SiteCreationStep.CREATION_CONFIRMATION,
        siteData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
        currentUser: { currentUser: buildUser() },
      });

      await store.dispatch(saveSiteAction());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        saveLoadingState: "success",
      });
    });
  });
});
