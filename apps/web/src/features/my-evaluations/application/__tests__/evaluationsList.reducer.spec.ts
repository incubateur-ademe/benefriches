import { createStore, type RootState } from "@/app/store/store";
import { InMemorySiteEvaluationService } from "@/features/my-evaluations/infrastructure/projects-list-service/InMemorySiteEvaluationsService";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import type { UserSiteEvaluation } from "../../core/types";
import {
  fetchUserSiteEvaluations,
  projectRemovedFromEvaluationList,
  siteRemovedFromEvaluationList,
} from "../evaluationsList.actions";

const site1: UserSiteEvaluation = {
  siteId: "site-1",
  siteName: "Site 1",
  siteNature: "FRICHE",
  isExpressSite: false,
  isEditable: true,
  notEditableReason: null,
  reconversionProjects: {
    total: 2,
    lastProjects: [
      { id: "p1", name: "Project 1", projectType: "URBAN_PROJECT", isExpressProject: false },
      { id: "p2", name: "Project 2", projectType: "URBAN_PROJECT", isExpressProject: false },
    ],
  },
  compatibilityEvaluation: { top3Usages: [] },
};

const site2: UserSiteEvaluation = {
  siteId: "site-2",
  siteName: "Site 2",
  siteNature: "FRICHE",
  isExpressSite: false,
  isEditable: true,
  notEditableReason: null,
  reconversionProjects: { total: 0, lastProjects: [] },
  compatibilityEvaluation: { top3Usages: [] },
};

describe("evaluationsList reducer", () => {
  it("sets loadingState to success and stores the site evaluations when the fetch succeeds", async () => {
    const store = createStore(
      getTestAppDependencies({
        siteEvaluationService: new InMemorySiteEvaluationService([site1, site2]),
      }),
    );

    await store.dispatch(fetchUserSiteEvaluations());

    expect(store.getState().evaluationsList).toEqual({
      loadingState: "success",
      siteEvaluations: [site1, site2],
    });
  });

  it("sets loadingState to error and clears the site evaluations when the fetch fails", async () => {
    const store = createStore(
      getTestAppDependencies({
        siteEvaluationService: new InMemorySiteEvaluationService([site1, site2], true),
      }),
    );

    await store.dispatch(fetchUserSiteEvaluations());

    expect(store.getState().evaluationsList).toEqual({
      loadingState: "error",
      siteEvaluations: [],
    });
  });

  it("removes a site from the list when it is removed from the evaluation list", () => {
    const store = createStore(getTestAppDependencies(), {
      evaluationsList: {
        loadingState: "success",
        siteEvaluations: [site1, site2],
      } satisfies RootState["evaluationsList"],
    });

    store.dispatch(siteRemovedFromEvaluationList("site-1"));

    expect(store.getState().evaluationsList.siteEvaluations).toEqual([site2]);
  });

  it("removes a project from a site's last projects when it is removed from the evaluation list", () => {
    const store = createStore(getTestAppDependencies(), {
      evaluationsList: {
        loadingState: "success",
        siteEvaluations: [site1, site2],
      } satisfies RootState["evaluationsList"],
    });

    store.dispatch(projectRemovedFromEvaluationList({ siteId: "site-1", projectId: "p1" }));

    const [updatedSite1, updatedSite2] = store.getState().evaluationsList.siteEvaluations;
    expect(updatedSite1?.reconversionProjects).toEqual({
      total: 1,
      lastProjects: [
        { id: "p2", name: "Project 2", projectType: "URBAN_PROJECT", isExpressProject: false },
      ],
    });
    expect(updatedSite2).toEqual(site2);
  });

  it("leaves the state unchanged when the removed project's site is unknown", () => {
    const store = createStore(getTestAppDependencies(), {
      evaluationsList: {
        loadingState: "success",
        siteEvaluations: [site1, site2],
      } satisfies RootState["evaluationsList"],
    });
    const stateBefore = store.getState().evaluationsList;

    store.dispatch(projectRemovedFromEvaluationList({ siteId: "unknown", projectId: "p1" }));

    expect(store.getState().evaluationsList).toEqual(stateBefore);
  });
});
