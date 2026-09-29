import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { InMemoryAnalytics } from "@/features/analytics/infrastructure/InMemoryAnalytics";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { pageViewed } from "../pageViewed.action";

describe("pageViewed", () => {
  it("should track page view with url", async () => {
    const analyticsService = new InMemoryAnalytics();
    const store = createStore(getTestAppDependencies({ analyticsService }));

    await store.dispatch(pageViewed({ url: "/my-page?query=1" }));

    expect(analyticsService._pageViews).toEqual(["/my-page?query=1"]);
  });

  it("redacts a token query parameter before tracking", async () => {
    const analyticsService = new InMemoryAnalytics();
    const store = createStore(getTestAppDependencies({ analyticsService }));

    await store.dispatch(pageViewed({ url: "/emails/desinscription?token=v1.abc.def" }));

    expect(analyticsService._pageViews).toEqual(["/emails/desinscription?token=REDACTED"]);
  });

  it("keeps other query parameters when redacting the token", async () => {
    const analyticsService = new InMemoryAnalytics();
    const store = createStore(getTestAppDependencies({ analyticsService }));

    await store.dispatch(
      pageViewed({ url: "/authentification/token?token=abc&redirectTo=%2Fmes-evaluations" }),
    );

    expect(analyticsService._pageViews).toEqual([
      "/authentification/token?token=REDACTED&redirectTo=%2Fmes-evaluations",
    ]);
  });
});
