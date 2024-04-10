const stringToNumber = (value: string) => {
  const output = parseFloat(value);
  return isNaN(output) ? null : output;
};

const numberToString = (value: number) => {
  return isNaN(value) ? "" : value.toString();
};

export { numberToString, stringToNumber };
