import { decimalStringToNumber, numberToString, stringToNumber } from "./numberConversion";

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

describe("decimalStringToNumber", () => {
  const validInputs: [string, number][] = [
    ["3", 3],
    ["2,5", 2.5],
    ["2.5", 2.5],
    [",5", 0.5],
    [" 12,75 ", 12.75],
    ["-1,5", -1.5],
  ];
  for (const [input, expected] of validInputs) {
    it(`parses "${input}" as ${expected}`, () => {
      expect(decimalStringToNumber(input)).toEqual(expected);
    });
  }

  const invalidInputs = ["", "abc", "2,5,1", "2.5.1", "1e3", "2,", "2 5"];
  for (const input of invalidInputs) {
    it(`returns undefined for "${input}"`, () => {
      expect(decimalStringToNumber(input)).toBeUndefined();
    });
  }
});
