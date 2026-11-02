import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { siteNatureSchema } from "shared";

import { CREATION_MODES, drawRunPlan, PERSONAS, PROJECT_TYPES, QUIRKS } from "./run-plan";

const SEEDS = Array.from({ length: 200 }, (_, index) => index * 7919);

describe("drawRunPlan", () => {
  it("draws the same plan from the same seed", () => {
    assert.deepStrictEqual(drawRunPlan(42), drawRunPlan(42));
  });

  it("draws a plan from a seed", () => {
    assert.deepStrictEqual(drawRunPlan(42), {
      seed: 42,
      persona: "saboteur",
      siteNature: "AGRICULTURAL_OPERATION",
      projectType: "PHOTOVOLTAIC_POWER_PLANT",
      creationMode: "custom",
      quirks: ["refresh-mid-wizard", "double-submit"],
    });
  });

  const pools = [
    { field: "persona", values: PERSONAS },
    { field: "siteNature", values: siteNatureSchema.options },
    { field: "projectType", values: PROJECT_TYPES },
    { field: "creationMode", values: CREATION_MODES },
  ] as const;
  for (const { field, values } of pools) {
    it(`draws every ${field} across seeds`, () => {
      const drawn = new Set(SEEDS.map((seed) => drawRunPlan(seed)[field]));

      assert.deepStrictEqual(drawn, new Set(values));
    });
  }

  it("draws every quirk across seeds", () => {
    const drawn = new Set(SEEDS.flatMap((seed) => drawRunPlan(seed).quirks));

    assert.deepStrictEqual(drawn, new Set(QUIRKS));
  });

  it("draws 2 or 3 distinct quirks, both counts across seeds", () => {
    const quirkLists = SEEDS.map((seed) => drawRunPlan(seed).quirks);
    const counts = new Set(quirkLists.map((quirks) => quirks.length));
    const listsWithDuplicates = quirkLists.filter(
      (quirks) => new Set(quirks).size !== quirks.length,
    );

    assert.deepStrictEqual(counts, new Set([2, 3]));
    assert.deepStrictEqual(listsWithDuplicates, []);
  });
});
