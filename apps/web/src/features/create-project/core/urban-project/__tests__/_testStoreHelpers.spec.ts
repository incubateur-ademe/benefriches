import { describe, expect, it } from "vitest";

import { mockSiteData } from "./_siteData.mock";
import { StoreBuilder } from "./_testStoreHelpers";

describe("urban project test StoreBuilder", () => {
  it("preserves default site fields when overriding a subset", () => {
    const store = new StoreBuilder()
      .withSiteData({
        hasContaminatedSoils: false,
      })
      .build();

    const siteData = store.getState().projectCreation.siteData;

    expect(siteData).toMatchObject({
      ...mockSiteData,
      hasContaminatedSoils: false,
    });
  });

  it("replaces soilsDistribution with the provided full distribution", () => {
    const fullDistribution = {
      ...mockSiteData.soilsDistribution,
      BUILDINGS: 0,
      IMPERMEABLE_SOILS: 999,
    };

    const store = new StoreBuilder()
      .withSiteData({
        soilsDistribution: fullDistribution,
      })
      .build();

    const siteData = store.getState().projectCreation.siteData;

    expect(siteData?.soilsDistribution).toEqual(fullDistribution);
  });
});
