import { createStore, type RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectMyEvaluationsViewData } from "../myEvaluations.selectors";

describe("selectMyEvaluationsViewData", () => {
  it("returns composed view data from state", () => {
    const siteEvaluation = {
      siteId: "site-1",
      siteName: "My Site",
      siteNature: "FRICHE" as const,
      isExpressSite: false,
      reconversionProjects: { total: 1, lastProjects: [] },
      compatibilityEvaluation: { top3Usages: [] },
    };

    const store = createStore(getTestAppDependencies(), {
      evaluationsList: {
        loadingState: "success",
        siteEvaluations: [siteEvaluation],
      } satisfies RootState["evaluationsList"],
      currentUser: {
        currentUser: {
          id: "user-1",
          email: "user@example.com",
          firstName: "John",
          lastName: "Doe",
          structureType: "local_authority",
          structureActivity: "municipality",
        },
        currentUserState: "authenticated",
        createUserState: "idle",
      } satisfies RootState["currentUser"],
    });

    const viewData = selectMyEvaluationsViewData(store.getState());

    expect(viewData).toEqual({
      siteEvaluations: [siteEvaluation],
      loadingState: "success",
      currentUserId: "user-1",
    });
  });

  it("returns idle state with empty evaluations when not yet loaded", () => {
    const store = createStore(getTestAppDependencies());

    const viewData = selectMyEvaluationsViewData(store.getState());

    expect(viewData).toEqual({
      siteEvaluations: [],
      loadingState: "idle",
      currentUserId: undefined,
    });
  });
});
