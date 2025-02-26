import { buildUser } from "@/features/onboarding/core/user.mock";
import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryCreateSiteService } from "../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { customSiteSaved, expressSiteSaved } from "../actions/siteSaved.actions";
import {
  expressSiteDraft,
  fricheWithExhaustiveData,
  fricheWithMinimalData,
  siteWithExhaustiveData,
  siteWithMinimalData,
} from "../siteData.mock";
import getExpressSiteData from "../siteExpress";
import { expectNewCurrentStep, expectSiteDataUnchanged } from "./testHelpers";

describe("Save created site", () => {
  describe("custom creation", () => {
    it("should be in error state when site data in store is not valid (missing name)", async () => {
      const siteData = { ...siteWithMinimalData, name: undefined };
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        stepsHistory: ["FINAL_SUMMARY"],
        siteData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      const initialRootState = store.getState();
      await store.dispatch(customSiteSaved());

      const newState = store.getState();
      expectSiteDataUnchanged(initialRootState, newState);
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
    });

    it("should be in error state when no user id in store", async () => {
      const store = createStore(getTestAppDependencies(), {
        siteCreation: {
          saveLoadingState: "idle",
          stepsHistory: ["FINAL_SUMMARY"],
          siteData: siteWithMinimalData,
        },
      });
      const initialRootState = store.getState();
      await store.dispatch(customSiteSaved());

      const newState = store.getState();
      expectSiteDataUnchanged(initialRootState, newState);
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
    });

    it("should be in error state when createSiteService fails", async () => {
      const shouldFail = true;
      const store = createStore(
        getTestAppDependencies({ createSiteService: new InMemoryCreateSiteService(shouldFail) }),
        {
          siteCreation: {
            saveLoadingState: "idle",
            stepsHistory: ["FINAL_SUMMARY"],
            siteData: siteWithMinimalData,
          },
          currentUser: {
            currentUser: buildUser(),
            createUserState: "idle",
            currentUserLoaded: true,
          },
        },
      );
      const initialRootState = store.getState();
      await store.dispatch(customSiteSaved());

      const newState = store.getState();
      expectSiteDataUnchanged(initialRootState, newState);
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
    });

    it("should call createSiteService with creationMode = 'custom'", async () => {
      const createSiteService = new InMemoryCreateSiteService();

      const spy = vi.spyOn(createSiteService, "save");
      const user = buildUser();

      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        stepsHistory: ["FINAL_SUMMARY"],
        siteData: siteWithMinimalData,
      };

      const store = createStore(getTestAppDependencies({ createSiteService }), {
        siteCreation: initialState,
        currentUser: {
          currentUser: user,
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      await store.dispatch(customSiteSaved());

      expect(spy).toHaveBeenCalledWith({
        address: siteWithMinimalData.address,
        id: siteWithMinimalData.id,
        isFriche: siteWithMinimalData.isFriche,
        name: siteWithMinimalData.name,
        owner: siteWithMinimalData.owner,
        soilsDistribution: siteWithMinimalData.soilsDistribution,
        yearlyExpenses: siteWithMinimalData.yearlyExpenses,
        yearlyIncomes: siteWithMinimalData.yearlyIncomes,
        creationMode: "custom",
        createdBy: user.id,
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
        stepsHistory: ["FINAL_SUMMARY"],
        siteData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      const initialRootState = store.getState();

      await store.dispatch(customSiteSaved());

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
      expect(newState.siteCreation.saveLoadingState).toEqual("success");
    });
  });

  describe("express creation", () => {
    it("should be in error state when site data in store is not valid (missing surfaceArea)", async () => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        stepsHistory: ["SURFACE_AREA"],
        siteData: { ...expressSiteDraft, surfaceArea: undefined },
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      const initialRootState = store.getState();

      await store.dispatch(expressSiteSaved());

      const newState = store.getState();
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
    });

    it("should be in error state when no user id in store", async () => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        stepsHistory: ["CREATION_RESULT"],
        siteData: expressSiteDraft,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
      });
      const initialRootState = store.getState();

      await store.dispatch(expressSiteSaved());

      const newState = store.getState();
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
    });

    it("should be in error state when createSiteService fails", async () => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        stepsHistory: ["CREATION_RESULT"],
        siteData: expressSiteDraft,
      };

      const shouldFail = true;
      const store = createStore(
        getTestAppDependencies({ createSiteService: new InMemoryCreateSiteService(shouldFail) }),
        {
          siteCreation: initialState,
          currentUser: {
            currentUser: buildUser(),
            createUserState: "idle",
            currentUserLoaded: true,
          },
        },
      );
      const initialRootState = store.getState();

      await store.dispatch(expressSiteSaved());

      const newState = store.getState();
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
    });

    it("should call createSiteService with the right payload", async () => {
      const createSiteService = new InMemoryCreateSiteService();

      const spy = vi.spyOn(createSiteService, "save");
      const user = buildUser();

      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        stepsHistory: ["CREATION_RESULT"],
        siteData: expressSiteDraft,
      };

      const store = createStore(getTestAppDependencies({ createSiteService }), {
        siteCreation: initialState,
        currentUser: {
          currentUser: user,
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      await store.dispatch(expressSiteSaved());

      expect(spy).toHaveBeenCalledWith(getExpressSiteData(expressSiteDraft, user.id));
    });

    it.each([
      { siteData: expressSiteDraft, dataType: "express friche" },
      { siteData: { ...expressSiteDraft, isFriche: false }, dataType: "express non friche" },
    ])("should be in success state when saving $dataType", async ({ siteData }) => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        stepsHistory: ["CREATION_RESULT"],
        siteData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });

      await store.dispatch(expressSiteSaved());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        stepsHistory: [...initialState.stepsHistory, "CREATION_RESULT"],
        siteData: {
          ...initialState.siteData,
          name: expect.any(String) as string,
        },
        saveLoadingState: "success",
      });
    });
  });
});
