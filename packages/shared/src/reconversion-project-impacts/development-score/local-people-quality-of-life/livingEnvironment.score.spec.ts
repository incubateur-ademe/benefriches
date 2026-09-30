import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getLivingEnvironmentScore } from "./livingEnvironment.score";

describe("livingEnvironment score", () => {
  it(`returns A grade for friche reconversion`, () => {
    const result = getLivingEnvironmentScore("friche");
    assert.strictEqual(result?.letterGrade, "A");
    assert.strictEqual(result?.metrics.siteReconversionType, "friche");
  });

  it(`returns D grade for agricultural friche reconversion`, () => {
    const result = getLivingEnvironmentScore("friche_agricole");
    assert.strictEqual(result?.letterGrade, "D");
  });

  it(`returns E grade for ENAF reconversion`, () => {
    const result = getLivingEnvironmentScore("enaf");
    assert.strictEqual(result?.letterGrade, "E");
  });
});
