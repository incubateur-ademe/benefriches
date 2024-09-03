import { startsByVowel } from "./startsByVowel";

describe("Strings: startsByVowel service", () => {
  it("return true for simple vowel", () => {
    expect(startsByVowel("accent")).toEqual(true);
  });
  it("return true for accentuated vowel", () => {
    expect(startsByVowel("éléphant")).toEqual(true);
  });
  it("return true for uppercase vowel", () => {
    expect(startsByVowel("Instant")).toEqual(true);
  });
  it("return true for accentuated uppercase vowel", () => {
    expect(startsByVowel("Éléphant")).toEqual(true);
  });
  it("return false for common consonant", () => {
    expect(startsByVowel("cheminée")).toEqual(false);
  });
  it("return false for uppercase consonant", () => {
    expect(startsByVowel("Test")).toEqual(false);
  });
  it("return false for number", () => {
    expect(startsByVowel("15")).toEqual(false);
  });
});
