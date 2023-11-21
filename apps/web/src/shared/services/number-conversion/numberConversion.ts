const stringToNumber = (value: string) => {
  const output = parseFloat(value);
  return isNaN(output) ? undefined : output;
};

const numberToString = (value: number) => {
  return isNaN(value) ? "" : value.toString();
};

export { numberToString, stringToNumber };
