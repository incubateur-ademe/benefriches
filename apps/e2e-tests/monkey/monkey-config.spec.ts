import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { readMonkeyConfig } from "./monkey-config";

const REQUIRED_ENV = {
  BASE_URL: "https://staging.example.org",
  E2E_TESTMAIL_NAMESPACE: "namespace",
  E2E_TESTMAIL_API_KEY: "api-key",
};

describe("readMonkeyConfig seed", () => {
  it("uses MONKEY_SEED when it is set", () => {
    const config = readMonkeyConfig({ ...REQUIRED_ENV, MONKEY_SEED: "1234" });

    assert.equal(config.seed, 1234);
  });

  for (const invalidSeed of ["-1", "1.5", "abc", "4294967296"]) {
    it(`rejects MONKEY_SEED "${invalidSeed}"`, () => {
      assert.throws(() => readMonkeyConfig({ ...REQUIRED_ENV, MONKEY_SEED: invalidSeed }), {
        message: `Invalid MONKEY_SEED "${invalidSeed}": expected an integer from 0 to 4294967295`,
      });
    });
  }
});
