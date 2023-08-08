import { CryptoHashGenerator } from "./CryptoHashGenerator";

describe("CryptoHashGenerator", () => {
  test("Validates hash string", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const hasher = new CryptoHashGenerator(2);
    const str = "my-string";
    const hash = await hasher.generate(str);
    expect(await hasher.compare(str, hash)).toEqual(true);
  });

  test("Does not validate hash with different input", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const hasher = new CryptoHashGenerator(3);
    const str1 = "my-string";
    const hash = await hasher.generate(str1);
    expect(await hasher.compare("another-string", hash)).toEqual(false);
  });
});
