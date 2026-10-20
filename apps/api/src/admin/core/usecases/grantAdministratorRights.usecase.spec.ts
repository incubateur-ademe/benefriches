import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryAdministratorRepository } from "src/admin/adapters/secondary/InMemoryAdministratorRepository";
import {
  ADMINISTRATOR_GRANTED,
  type AdministratorGrantedEvent,
} from "src/admin/core/events/administratorGranted.event";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";

import { GrantAdministratorRightsUseCase } from "./grantAdministratorRights.usecase";

const fakeNow = new Date("2026-10-20T10:00:00.000Z");
const user = { id: "user-1", email: "Jane.Doe@ademe.fr" };

describe("GrantAdministratorRights UseCase", () => {
  it("grants administrator rights to a user found by id", async () => {
    const repository = new InMemoryAdministratorRepository();
    repository._setUsers([user]);
    repository._setAdministrators([]);
    const uidGenerator = new DeterministicUuidGenerator();
    uidGenerator.nextUuids("event-id");
    const usecase = new GrantAdministratorRightsUseCase(
      repository,
      new DeterministicDateProvider(fakeNow),
      uidGenerator,
      new InMemoryEventPublisher(),
    );

    const result = await usecase.execute({ identifiedBy: "userId", userId: "user-1" });

    assert.ok(result.isSuccess());
    assert.deepStrictEqual(result.getData(), {
      outcome: "granted",
      user: { id: "user-1", email: "Jane.Doe@ademe.fr" },
    });
    assert.deepStrictEqual(repository._getAdministrators(), [
      { userId: "user-1", grantedAt: fakeNow },
    ]);
  });

  it("publishes administrator.granted on a real grant", async () => {
    const repository = new InMemoryAdministratorRepository();
    repository._setUsers([user]);
    repository._setAdministrators([]);
    const uidGenerator = new DeterministicUuidGenerator();
    uidGenerator.nextUuids("event-id");
    const eventPublisher = new InMemoryEventPublisher();
    const usecase = new GrantAdministratorRightsUseCase(
      repository,
      new DeterministicDateProvider(fakeNow),
      uidGenerator,
      eventPublisher,
    );

    await usecase.execute({ identifiedBy: "userId", userId: "user-1" });

    assert.deepStrictEqual(eventPublisher.events, [
      {
        id: "event-id",
        name: ADMINISTRATOR_GRANTED,
        payload: { userId: "user-1", userEmail: "Jane.Doe@ademe.fr" },
      } satisfies AdministratorGrantedEvent,
    ]);
  });

  it("finds the user by email ignoring case and surrounding whitespace", async () => {
    const repository = new InMemoryAdministratorRepository();
    repository._setUsers([user]);
    const uidGenerator = new DeterministicUuidGenerator();
    uidGenerator.nextUuids("event-id");
    const usecase = new GrantAdministratorRightsUseCase(
      repository,
      new DeterministicDateProvider(fakeNow),
      uidGenerator,
      new InMemoryEventPublisher(),
    );

    const result = await usecase.execute({ identifiedBy: "email", email: "  JANE.doe@ADEME.fr " });

    assert.ok(result.isSuccess());
    assert.deepStrictEqual(result.getData(), {
      outcome: "granted",
      user: { id: "user-1", email: "Jane.Doe@ademe.fr" },
    });
  });

  it("leaves an existing administrator unchanged and publishes nothing", async () => {
    const earlier = new Date("2026-01-01T08:00:00.000Z");
    const repository = new InMemoryAdministratorRepository();
    repository._setUsers([user]);
    repository._setAdministrators([{ userId: "user-1", grantedAt: earlier }]);
    const eventPublisher = new InMemoryEventPublisher();
    const usecase = new GrantAdministratorRightsUseCase(
      repository,
      new DeterministicDateProvider(fakeNow),
      new DeterministicUuidGenerator(),
      eventPublisher,
    );

    const result = await usecase.execute({ identifiedBy: "userId", userId: "user-1" });

    assert.ok(result.isSuccess());
    assert.deepStrictEqual(result.getData(), {
      outcome: "alreadyAdministrator",
      user: { id: "user-1", email: "Jane.Doe@ademe.fr" },
    });
    assert.deepStrictEqual(repository._getAdministrators(), [
      { userId: "user-1", grantedAt: earlier },
    ]);
    assert.strictEqual(eventPublisher.events.length, 0);
  });

  it("fails with UserNotFound for an unknown email and writes nothing", async () => {
    const repository = new InMemoryAdministratorRepository();
    repository._setUsers([{ id: "user-1", email: "other@ademe.fr" }]);
    const eventPublisher = new InMemoryEventPublisher();
    const usecase = new GrantAdministratorRightsUseCase(
      repository,
      new DeterministicDateProvider(fakeNow),
      new DeterministicUuidGenerator(),
      eventPublisher,
    );

    const result = await usecase.execute({ identifiedBy: "email", email: "jane@ademe.fr" });

    assert.ok(result.isFailure());
    assert.strictEqual(result.getError(), "UserNotFound");
    assert.deepStrictEqual(repository._getAdministrators(), []);
    assert.strictEqual(eventPublisher.events.length, 0);
  });

  it("fails with UserNotFound for an unknown id and writes nothing", async () => {
    const repository = new InMemoryAdministratorRepository();
    repository._setUsers([]);
    const eventPublisher = new InMemoryEventPublisher();
    const usecase = new GrantAdministratorRightsUseCase(
      repository,
      new DeterministicDateProvider(fakeNow),
      new DeterministicUuidGenerator(),
      eventPublisher,
    );

    const result = await usecase.execute({ identifiedBy: "userId", userId: "missing" });

    assert.ok(result.isFailure());
    assert.strictEqual(result.getError(), "UserNotFound");
    assert.deepStrictEqual(repository._getAdministrators(), []);
    assert.strictEqual(eventPublisher.events.length, 0);
  });

  it("fails with AmbiguousEmail when several users share the email case-insensitively", async () => {
    const matchingUsers = [
      { id: "user-1", email: "jane@ademe.fr" },
      { id: "user-2", email: "Jane@ademe.fr" },
    ];
    const repository = new InMemoryAdministratorRepository();
    repository._setUsers(matchingUsers);
    const eventPublisher = new InMemoryEventPublisher();
    const usecase = new GrantAdministratorRightsUseCase(
      repository,
      new DeterministicDateProvider(fakeNow),
      new DeterministicUuidGenerator(),
      eventPublisher,
    );

    const result = await usecase.execute({ identifiedBy: "email", email: "jane@ademe.fr" });

    assert.ok(result.isFailure());
    assert.strictEqual(result.getError(), "AmbiguousEmail");
    assert.deepStrictEqual(result.getIssues(), { matchingUsers });
    assert.deepStrictEqual(repository._getAdministrators(), []);
    assert.strictEqual(eventPublisher.events.length, 0);
  });
});
