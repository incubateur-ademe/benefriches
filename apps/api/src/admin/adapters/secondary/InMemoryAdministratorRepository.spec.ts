import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryAdministratorRepository } from "./InMemoryAdministratorRepository";

describe("InMemoryAdministratorRepository", () => {
  it("grant reports created and stores the row for a new administrator", async () => {
    const repository = new InMemoryAdministratorRepository();
    repository._setAdministrators([]);
    const grantedAt = new Date("2026-10-20T10:00:00.000Z");

    const result = await repository.grant("user-1", grantedAt);

    assert.deepStrictEqual(result, { created: true });
    assert.deepStrictEqual(repository._getAdministrators(), [{ userId: "user-1", grantedAt }]);
  });

  it("grant refuses a duplicate and keeps the existing row", async () => {
    const earlier = new Date("2026-01-01T08:00:00.000Z");
    const later = new Date("2026-10-20T10:00:00.000Z");
    const repository = new InMemoryAdministratorRepository();
    repository._setAdministrators([{ userId: "user-1", grantedAt: earlier }]);

    const result = await repository.grant("user-1", later);

    assert.deepStrictEqual(result, { created: false });
    assert.deepStrictEqual(repository._getAdministrators(), [
      { userId: "user-1", grantedAt: earlier },
    ]);
  });
});
