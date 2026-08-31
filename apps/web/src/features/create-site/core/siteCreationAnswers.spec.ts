import { describe, expect, it } from "vitest";

import { deriveSiteDataFromAnswers, SiteCreationAnswers } from "./siteCreationAnswers";
import { SiteCreationData } from "./siteFoncier.types";

const buildInitialSiteData = (): SiteCreationData => ({
  id: "site-id",
  soils: [],
  yearlyExpenses: [],
  yearlyIncomes: [],
});

describe("deriveSiteDataFromAnswers", () => {
  it("returns the initial site data unchanged when the answers map is empty", () => {
    const initialSiteData = buildInitialSiteData();
    const answers: SiteCreationAnswers = {};

    const result = deriveSiteDataFromAnswers(initialSiteData, answers);

    expect(result).toEqual(initialSiteData);
  });

  it("merges deltas from two non-overlapping steps into the result", () => {
    const initialSiteData = buildInitialSiteData();
    const answers: SiteCreationAnswers = {
      IS_FRICHE: { isFriche: true, nature: "FRICHE" },
      FRICHE_ACTIVITY: { fricheActivity: "INDUSTRY" },
    };

    const result = deriveSiteDataFromAnswers(initialSiteData, answers);

    expect(result).toEqual({
      ...initialSiteData,
      isFriche: true,
      nature: "FRICHE",
      fricheActivity: "INDUSTRY",
    });
  });

  it("lets a later step's delta win when two steps write the same field", () => {
    const initialSiteData = buildInitialSiteData();
    // Simulates SPACES_KNOWLEDGE auto-filling soilsDistribution, then
    // SPACES_SURFACE_AREA_DISTRIBUTION overwriting it with the user's own choice.
    const answers: SiteCreationAnswers = {
      SPACES_KNOWLEDGE: {
        spacesDistributionKnowledge: false,
        soilsDistribution: { BUILDINGS: 15000, MINERAL_SOIL: 15000 },
        soils: ["BUILDINGS", "MINERAL_SOIL"],
      },
      SPACES_SURFACE_AREA_DISTRIBUTION: {
        soilsDistribution: { BUILDINGS: 20000, MINERAL_SOIL: 10000 },
      },
    };

    const result = deriveSiteDataFromAnswers(initialSiteData, answers);

    expect(result.soilsDistribution).toEqual({ BUILDINGS: 20000, MINERAL_SOIL: 10000 });
  });
});
