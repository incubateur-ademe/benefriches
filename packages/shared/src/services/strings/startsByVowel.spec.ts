import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { startsByVowel } from "./startsByVowel.js";

describe("Strings: startsByVowel service", () => {
  it("return true for simple vowel", () => {
    assert.strictEqual(startsByVowel("accent"), true);
  });
  it("return true for accentuated vowel", () => {
    assert.strictEqual(startsByVowel("éléphant"), true);
  });
  it("return true for uppercase vowel", () => {
    assert.strictEqual(startsByVowel("Instant"), true);
  });
  it("return true for accentuated uppercase vowel", () => {
    assert.strictEqual(startsByVowel("Éléphant"), true);
  });
  it("return false for common consonant", () => {
    assert.strictEqual(startsByVowel("cheminée"), false);
  });
  it("return false for uppercase consonant", () => {
    assert.strictEqual(startsByVowel("Test"), false);
  });
  it("return false for number", () => {
    assert.strictEqual(startsByVowel("15"), false);
  });
});
