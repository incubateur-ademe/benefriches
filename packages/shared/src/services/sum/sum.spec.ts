import { sumList, sumObjectValues } from "./sum";

describe("sum util", () => {
  describe("sumObjectValues", () => {
    it.each([
      { input: {}, output: 0 },
      { input: { a: 1, b: 2, c: 3 }, output: 6 },
      { input: { a: 10, b: 15, c: undefined }, output: 25 },
    ])("returns $output for $input", ({ input, output }) => {
      // @ts-expect-error invalid input
      expect(sumObjectValues(input)).toEqual(output);
    });
  });

  describe("sumList", () => {
    it.each([
      { input: [], output: 0 },
      { input: [10, 50, 100, 0], output: 160 },
    ])("returns $output for $input", ({ input, output }) => {
      expect(sumList(input)).toEqual(output);
    });
  });
});
