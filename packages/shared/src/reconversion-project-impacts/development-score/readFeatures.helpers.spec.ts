import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import type { FricheActivity, SiteNature } from "../../site";
import {
  filterBuildingsUses,
  getEvolutionAsPercentage,
  getSiteReconversionType,
  getSoilEvolutionDetails,
} from "./readFeatures.helpers";

const CONTEXT_DATA: GetReconversionProjectImpactsResultDto["contextData"] = {
  projectName: "Project photovoltaïque",
  projectId: "1b521325-ee61-40fb-8462-e01669ac767b",
  relatedSiteId: "68382abb-3a81-45e6-8af4-913767a28141",
  relatedSiteName: "Friche agricole de Blajan",
  isExpressSite: false,
  isExpressProject: false,
  siteAddress: {
    label: "Blajan",
    lat: 2.45,
    long: 45.26,
  },
  siteNature: "FRICHE",
  siteSurfaceArea: 90000,
  fricheActivity: "INDUSTRY",
  projectDevelopmentPlan: {
    type: "PHOTOVOLTAIC_POWER_PLANT" as const,
    installationElectricalPowerKWc: 1000,
    installationSurfaceArea: 2300,
  },
  municipalityCapitalExpenditures: { amount: 15000000, referenceYear: "2025" },
};

describe("readFeatures helpers", () => {
  describe("getEvolutionAsPercentage", () => {
    it(`returns +2%`, () => {
      assert.strictEqual(getEvolutionAsPercentage({ before: 10, difference: 20 }), 200);
    });

    it(`returns difference * 100 if before value is 0`, () => {
      assert.strictEqual(getEvolutionAsPercentage({ before: 0, difference: 20 }), 2000);
    });

    it(`returns 0 if there is no difference`, () => {
      assert.strictEqual(getEvolutionAsPercentage({ before: 10, difference: 0 }), 0);
    });

    it(`returns positive percentage for negative before and positive difference`, () => {
      assert.strictEqual(getEvolutionAsPercentage({ before: -10, difference: 20 }), 200);
    });
    it(`returns negative percentage for positive before and negative difference`, () => {
      assert.strictEqual(getEvolutionAsPercentage({ before: 10, difference: -2 }), -20);
    });
  });

  describe("getSoilEvolutionDetails", () => {
    it(`returns contamination, newGreenSoilSurfaces, soilsDistribution and permeableSurfaceDifference`, () => {
      const result = getSoilEvolutionDetails({
        siteStatuQuoImpactMetrics: [
          { name: "contaminatedSurface", total: 500 },
          { name: "permeableGreenSurface", total: 1000 },
          { name: "permeableMineralSurface", total: 2000 },
          { name: "soilsDistribution", soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 1000 },
          { name: "soilsDistribution", soilType: "MINERAL_SOIL", total: 2000 },
        ],
        aggregatedReconversionImpactMetrics: [
          { name: "decontaminatedSurface", total: 250 },
          { name: "newPermeableMineralSurface", total: 2000 },
          { name: "newPermeableGreenSurface", total: 2000 },
          { name: "soilsDistribution", soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
          { name: "soilsDistribution", soilType: "MINERAL_SOIL", total: 2000 },
        ],
      });
      assert.strictEqual(result?.contamination.siteContaminatedSurface, 500);
      assert.strictEqual(result?.contamination.difference, 250);
      assert.strictEqual(result?.contamination.percentVariation, 50);
      assert.strictEqual(result.newGreenSoilSurfaces, 2000);
      assert.strictEqual(result?.permeableSurfaceDifference.difference, 4000);
      assert.strictEqual(result?.permeableSurfaceDifference.percentVariation, 133);
      assert.strictEqual(result?.soilsDistribution.length, 2);
    });
  });

  describe("getSiteReconversionType", () => {
    for (const fricheActivity of [
      "INDUSTRY",
      "MILITARY",
      "RAILWAY",
      "PORT",
      "TIP_OR_RECYCLING_SITE",
      "BUILDING",
      "OTHER",
    ] satisfies FricheActivity[]) {
      it(`returns friche for siteNature=friche and fricheActivity=${fricheActivity}`, () => {
        const result = getSiteReconversionType({
          ...CONTEXT_DATA,
          siteNature: "FRICHE",
          fricheActivity,
        });
        assert.strictEqual(result, "friche");
      });
    }

    it(`returns friche_agricole for siteNature=friche and fricheActivity=AGRICULTURE`, () => {
      const result = getSiteReconversionType({
        ...CONTEXT_DATA,
        siteNature: "FRICHE",
        fricheActivity: "AGRICULTURE",
      });
      assert.strictEqual(result, "friche_agricole");
    });
    for (const siteNature of ["AGRICULTURAL_OPERATION", "NATURAL_AREA"] satisfies SiteNature[]) {
      it(`returns enaf for siteNature=${siteNature}`, () => {
        const result = getSiteReconversionType({
          ...CONTEXT_DATA,
          siteNature: siteNature,
        });
        assert.strictEqual(result, "enaf");
      });
    }
  });

  describe("filterBuildingsUses", () => {
    it(`returns array with OFFICES and CINEMA buildings only`, () => {
      const result = filterBuildingsUses(
        { CINEMA: 1000, OFFICES: 500, SPORTS_FACILITIES: 1000, LOCAL_HEALTH_SERVICE: 1000 },
        new Set(["OFFICES", "CINEMA"]),
      );
      assert.strictEqual(result.length, 2);
      assert.ok(result.find((item) => item.buildingUse === "OFFICES"));
      assert.ok(result.find((item) => item.buildingUse === "CINEMA"));
    });

    it(`returns array with OFFICES buildings only`, () => {
      const result = filterBuildingsUses(
        { OFFICES: 500, SPORTS_FACILITIES: 1000, LOCAL_HEALTH_SERVICE: 1000 },
        new Set(["OFFICES", "CINEMA"]),
      );
      assert.strictEqual(result.length, 1);
      assert.strictEqual(
        result.findIndex((item) => item.buildingUse === "OFFICES"),
        0,
      );
    });
    it(`returns empty array`, () => {
      const result = filterBuildingsUses(
        { SPORTS_FACILITIES: 1000, LOCAL_HEALTH_SERVICE: 1000 },
        new Set(["OFFICES", "CINEMA"]),
      );
      assert.strictEqual(result.length, 0);
    });
  });
});
