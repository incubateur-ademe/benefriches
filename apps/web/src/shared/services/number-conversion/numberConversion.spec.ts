import { numberToString, stringToNumber } from "./numberConversion";

describe("Number conversio service", () => {
  it("converts number to string", () => {
    expect(numberToString(13000)).toEqual("13000");
  });
  it("converts string to number", () => {
    expect(stringToNumber("15.1")).toEqual(15.1);
  });
});
