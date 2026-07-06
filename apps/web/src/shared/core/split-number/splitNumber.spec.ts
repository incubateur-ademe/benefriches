import { splitEvenly } from "./splitNumber";

describe("splitEvenly", () => {
  it("should return [0] when total is 0", () => {
    expect(splitEvenly(0, 3)).toEqual([0]);
  });

  it("should return [0] when parts is 0", () => {
    expect(splitEvenly(100, 0)).toEqual([0]);
  });

  it("should return [total] when parts is 1", () => {
    expect(splitEvenly(100, 1)).toEqual([100]);
  });

  it("should split 100 into 2 equal parts", () => {
    expect(splitEvenly(100, 2)).toEqual([50, 50]);
  });

  it("should split 100 into 3 parts with remainder in last element", () => {
    const result = splitEvenly(100, 3);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(33.33);
    expect(result[1]).toEqual(33.33);
    expect(result[2]).toBeCloseTo(33.34, 2);
  });

  it("should ensure parts sum to total", () => {
    const total = 100;
    const parts = 7;
    const result = splitEvenly(total, parts);
    const sum = result.reduce((acc, v) => acc + Math.round(v * 100) / 100, 0);
    expect(Math.round(sum * 100) / 100).toBeCloseTo(total, 1);
  });
});
