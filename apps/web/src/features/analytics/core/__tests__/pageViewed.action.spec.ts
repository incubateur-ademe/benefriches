import { describe, expect, it } from "vitest";

import { InMemoryAnalytics } from "@/features/analytics/infrastructure/InMemoryAnalytics";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { pageViewed } from "../pageViewed.action";

describe("pageViewed", () => {
  it("should track page view with url", async () => {
    const analyticsService = new InMemoryAnalytics();
    const store = createStore(getTestAppDependencies({ analyticsService }));

    await store.dispatch(pageViewed({ url: "/my-page?query=1" }));

    expect(analyticsService._pageViews).toEqual(["/my-page?query=1"]);
  });
});
