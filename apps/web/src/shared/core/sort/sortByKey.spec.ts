import { sortByKey } from "./sortByKey";

describe("sortByKey", () => {
  it("should sort array of objects by string key ascending", () => {
    const input = [
      { name: "Charlie", age: 30 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 35 },
    ];
    const result = sortByKey(input, "name");
    expect(result.map((x) => x.name)).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("should sort array of objects by numeric key ascending", () => {
    const input = [
      { name: "Charlie", age: 30 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 35 },
    ];
    const result = sortByKey(input, "age");
    expect(result.map((x) => x.age)).toEqual([25, 30, 35]);
  });

  it("should return equal order for equal values", () => {
    const input = [
      { name: "Alice", score: 10 },
      { name: "Bob", score: 10 },
    ];
    const result = sortByKey(input, "score");
    expect(result.every((x) => x.score === 10)).toBe(true);
  });

  it("should not mutate the original array", () => {
    const input = [{ value: 3 }, { value: 1 }, { value: 2 }];
    const copy = [...input];
    sortByKey(input, "value");
    expect(input).toEqual(copy);
  });
});
