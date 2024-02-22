import { CryptoHashGenerator } from "./CryptoHashGenerator";

describe("CryptoHashGenerator", () => {
  test("Validates hash string", async () => {
    const hasher = new CryptoHashGenerator();
    const str = "my-string";
    const hash = await hasher.generate(str);
    expect(await hasher.compare(str, hash)).toEqual(true);
  });

  test("Does not validate hash with different input", async () => {
    const hasher = new CryptoHashGenerator();
    const str1 = "my-string";
    const hash = await hasher.generate(str1);
    expect(await hasher.compare("another-string", hash)).toEqual(false);
  });
});
