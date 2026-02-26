import { describe, expect, it } from "vitest";

import { InMemoryAnalytics } from "@/features/analytics/infrastructure/InMemoryAnalytics";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  expressSiteDisclaimerHidden,
  fricheFromCompatibilityEvaluationSaved,
  impactsAccuracyDisclaimerHidden,
  impactsExportDownloaded,
  impactsExportModalOpened,
} from "../analyticsEvents";
import { eventTracked } from "../eventTracked.action";

const setupStore = () => {
  const analyticsService = new InMemoryAnalytics();
  const store = createStore(getTestAppDependencies({ analyticsService }));
  return { store, analyticsService };
};

describe("eventTracked", () => {
  it("should track impactsExportModalOpened event", async () => {
    const { store, analyticsService } = setupStore();

    await store.dispatch(eventTracked(impactsExportModalOpened()));

    expect(analyticsService._events).toEqual([
      { category: "impacts-export", action: "modal-opened", name: "impacts-export-modal-opened" },
    ]);
  });

  it("should track impactsExportDownloaded event with export type", async () => {
    const { store, analyticsService } = setupStore();

    await store.dispatch(eventTracked(impactsExportDownloaded("pdf")));

    expect(analyticsService._events).toEqual([
      { category: "impacts-export", action: "downloaded", name: "impacts-export-downloaded-pdf" },
    ]);
  });

  it("should track expressSiteDisclaimerHidden event", async () => {
    const { store, analyticsService } = setupStore();

    await store.dispatch(eventTracked(expressSiteDisclaimerHidden()));

    expect(analyticsService._events).toEqual([
      {
        category: "site-page",
        action: "hide-express-site-disclaimer-clicked",
        name: "site-page/hide-express-site-disclaimer-clicked",
      },
    ]);
  });

  it("should track impactsAccuracyDisclaimerHidden event", async () => {
    const { store, analyticsService } = setupStore();

    await store.dispatch(eventTracked(impactsAccuracyDisclaimerHidden()));

    expect(analyticsService._events).toEqual([
      {
        category: "impacts-page",
        action: "hide-impacts-accuracy-disclaimer-clicked",
        name: "impacts-page/hide-impacts-accuracy-disclaimer-clicked",
      },
    ]);
  });

  it("should track fricheFromCompatibilityEvaluationSaved event", async () => {
    const { store, analyticsService } = setupStore();

    await store.dispatch(eventTracked(fricheFromCompatibilityEvaluationSaved()));

    expect(analyticsService._events).toEqual([
      {
        category: "reconversion-compatibility-evaluation-results",
        action: "save-friche-clicked",
        name: "save-friche-from-compatibility-evaluation-clicked",
      },
    ]);
  });
});
