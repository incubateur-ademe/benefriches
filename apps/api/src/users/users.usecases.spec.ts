import { sum } from "./users.usecases";

describe("first test", () => {
  test("1st test", () => {
    expect(sum(1, 2)).toEqual(4);
  });
});
