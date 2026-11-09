import { numberToString, stringToNumber } from "./numberConversion";

describe("Number conversion service", () => {
  it("converts number to string", () => {
    expect(numberToString(13000)).toEqual("13000");
  });

  const validInputs: [string, number][] = [
    ["3", 3],
    ["15.1", 15.1],
    ["2,5", 2.5],
    [" 12,75 ", 12.75],
    [",5", 0.5],
    ["-1,5", -1.5],
  ];
  for (const [input, expected] of validInputs) {
    it(`converts "${input}" to ${expected}`, () => {
      expect(stringToNumber(input)).toEqual(expected);
    });
  }

  for (const input of ["", "abc"]) {
    it(`converts "${input}" to undefined`, () => {
      expect(stringToNumber(input)).toBeUndefined();
    });
  }
});
