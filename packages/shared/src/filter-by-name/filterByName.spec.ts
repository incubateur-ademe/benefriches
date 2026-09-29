import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filterByName } from ".";

describe("filterByName", () => {
  it("keeps the items with any of the given names, in their order", () => {
    const items = [
      { name: "a", v: 1 },
      { name: "b", v: 2 },
      { name: "c", v: 3 },
    ];

    const result = filterByName(items, "c", "a");

    assert.deepStrictEqual(result, [
      { name: "a", v: 1 },
      { name: "c", v: 3 },
    ]);
  });

  for (const items of [null, undefined]) {
    it(`returns an empty list for a ${String(items)} list`, () => {
      assert.deepStrictEqual(filterByName<{ name: string }, string>(items, "a"), []);
    });
  }
});
