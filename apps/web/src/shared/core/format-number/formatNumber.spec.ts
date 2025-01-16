import { formatNumberFr } from "./formatNumber";

describe("formatNumberFr", () => {
  it("should print 'Valeur invalide' when string passed", () => {
    // @ts-expect-error called with a string instead of number
    expect(formatNumberFr("hello")).toEqual("Valeur invalide");
  });

  it.each([
    { input: 10, output: "10" },
    { input: 150, output: "150" },
    { input: 1590000, output: "1 590 000" },
  ])("should print $output when given $input", ({ input, output }) => {
    expect(formatNumberFr(input)).toEqual(output);
  });
});
