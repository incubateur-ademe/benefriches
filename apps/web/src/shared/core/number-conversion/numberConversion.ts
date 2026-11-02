const stringToNumber = (value: string) => {
  const output = parseFloat(value);
  return isNaN(output) ? undefined : output;
};

const numberToString = (value: number) => {
  return isNaN(value) ? "" : value.toString();
};

const DECIMAL_INPUT_PATTERN = /^-?\d*[.,]?\d+$/;

// Parses a decimal typed by a French-speaking user: "2,5" and "2.5" both give 2.5.
// Anything that is not a plain decimal number (e.g. "abc", "2,5,1") gives undefined.
const decimalStringToNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!DECIMAL_INPUT_PATTERN.test(trimmed)) return undefined;
  return Number(trimmed.replace(",", "."));
};

export { decimalStringToNumber, numberToString, stringToNumber };
