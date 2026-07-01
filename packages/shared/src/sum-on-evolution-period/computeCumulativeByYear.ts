export const computeCumulativeByYear = (impacts: number[]): number[] =>
  impacts.reduce<number[]>((acc, value) => {
    acc.push((acc.at(-1) ?? 0) + value);
    return acc;
  }, []);
