// Reads a number typed by a French-speaking user: "2,5" and "2.5" both give 2.5.
const stringToNumber = (value: string | number) => {
  const output = parseFloat(String(value).trim().replace(",", "."));
  return isNaN(output) ? undefined : output;
};

const numberToString = (value: number) => {
  return isNaN(value) ? "" : value.toString();
};

export { numberToString, stringToNumber };
