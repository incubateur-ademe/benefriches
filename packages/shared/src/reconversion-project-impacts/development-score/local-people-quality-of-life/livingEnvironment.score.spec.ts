import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getLivingEnvironmentScore } from "./livingEnvironment.score";

describe("livingEnvironment score", () => {
  it(`returns A grade for friche reconversion`, () => {
    const result = getLivingEnvironmentScore("friche");
    assert.strictEqual(result?.letterScore, "A");
    assert.strictEqual(result?.metrics.siteReconversionType, "friche");
  });

  it(`returns undefined grade for agricultural friche reconversion`, () => {
    const result = getLivingEnvironmentScore("friche_agricole");
    assert.strictEqual(result?.letterScore, undefined);
  });

  it(`returns undefined grade for ENAF reconversion`, () => {
    const result = getLivingEnvironmentScore("enaf");
    assert.strictEqual(result?.letterScore, undefined);
  });
});
