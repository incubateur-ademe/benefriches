import { filterObjectWithoutKeys } from "./filterObject";

describe("filterObjectWithoutKeys service", () => {
  it("return object without unwanted keys", () => {
    expect(
      filterObjectWithoutKeys({ key1: "test1", key2: "test2", key3: "test3" }, ["key1", "key2"]),
    ).toEqual({ key3: "test3" });

    expect(filterObjectWithoutKeys({ key1: "test1", key2: "test2", key3: "test3" }, [])).toEqual({
      key1: "test1",
      key2: "test2",
      key3: "test3",
    });
    expect(
      filterObjectWithoutKeys({ key1: "test1", key2: "test2", key3: "test3" }, [
        "key1",
        "key2",
        "key3",
      ]),
    ).toEqual({});
  });
});
