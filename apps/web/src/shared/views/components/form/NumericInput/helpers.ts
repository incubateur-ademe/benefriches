const stringToNumber = (value: string) => {
  const output = parseInt(value, 10);
  return isNaN(output) ? undefined : output;
};

const numberToString = (value: number) => {
  return isNaN(value) ? "" : value.toString();
};

export { numberToString, stringToNumber };
