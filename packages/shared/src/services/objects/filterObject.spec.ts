import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filterObjectWithoutKeys } from "./filterObject.js";

describe("filterObjectWithoutKeys service", () => {
  it("return object without unwanted keys", () => {
    assert.deepStrictEqual(
      filterObjectWithoutKeys({ key1: "test1", key2: "test2", key3: "test3" }, ["key1", "key2"]),
      { key3: "test3" },
    );

    assert.deepStrictEqual(
      filterObjectWithoutKeys({ key1: "test1", key2: "test2", key3: "test3" }, []),
      {
        key1: "test1",
        key2: "test2",
        key3: "test3",
      },
    );
    assert.deepStrictEqual(
      filterObjectWithoutKeys({ key1: "test1", key2: "test2", key3: "test3" }, [
        "key1",
        "key2",
        "key3",
      ]),
      {},
    );
  });
});
