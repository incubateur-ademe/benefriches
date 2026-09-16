import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import {
  createUserAccountCreatedEvent,
  USER_ACCOUNT_CREATED,
} from "src/auth/core/events/userAccountCreated.event";
import { SqlDomainEventsRepository } from "src/shared-kernel/adapters/events/repository/SqlDomainEventsRepository";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlUserSignupIntentQuery } from "./SqlUserSignupIntentQuery";

const ALICE_USER_ID = "22222222-2222-2222-2222-222222222222";

describe("SqlUserSignupIntentQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlUserSignupIntentQuery;
  let eventsRepository: SqlDomainEventsRepository;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    query = new SqlUserSignupIntentQuery(sqlConnection);
    eventsRepository = new SqlDomainEventsRepository(sqlConnection);
  });

  const saveMalformedSignupEvent = async (
    id: string,
    payload: Record<string, unknown>,
  ): Promise<void> => {
    await sqlConnection("domain_events").insert({ id, name: USER_ACCOUNT_CREATED, payload });
  };

  it("returns null when no signup event exists for the user id", async () => {
    const result = await query.findByUserId("33333333-3333-3333-3333-333333333333");

    assert.strictEqual(result, null);
  });

  it("returns the name and newsletter intent recorded at signup", async () => {
    await eventsRepository.save(
      createUserAccountCreatedEvent("11111111-1111-1111-1111-111111111111", {
        userId: ALICE_USER_ID,
        userEmail: "alice@example.com",
        userFirstName: "Alice",
        userLastName: "Martin",
        subscribedToNewsletter: true,
      }),
    );

    const result = await query.findByUserId(ALICE_USER_ID);

    assert.deepStrictEqual(result, {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });
  });

  it("does not return the signup event of another user", async () => {
    await eventsRepository.save(
      createUserAccountCreatedEvent("11111111-1111-1111-1111-111111111111", {
        userId: ALICE_USER_ID,
        userEmail: "alice@example.com",
        userFirstName: "Alice",
        userLastName: "Martin",
        subscribedToNewsletter: true,
      }),
    );

    const result = await query.findByUserId("44444444-4444-4444-4444-444444444444");

    assert.strictEqual(result, null);
  });

  it("matches on user id, not email, so a reused email cannot return another account's intent", async () => {
    const deletedAccountUserId = "55555555-5555-5555-5555-555555555555";
    const currentUserId = "66666666-6666-6666-6666-666666666666";
    await eventsRepository.save(
      createUserAccountCreatedEvent("11111111-1111-1111-1111-111111111111", {
        userId: deletedAccountUserId,
        userEmail: "reused@example.com",
        userFirstName: "Old",
        userLastName: "Account",
        subscribedToNewsletter: true,
      }),
    );
    await eventsRepository.save(
      createUserAccountCreatedEvent("11111111-1111-1111-1111-111111111112", {
        userId: currentUserId,
        userEmail: "reused@example.com",
        userFirstName: "New",
        userLastName: "Account",
        subscribedToNewsletter: false,
      }),
    );

    const result = await query.findByUserId(currentUserId);

    assert.deepStrictEqual(result, {
      firstName: "New",
      lastName: "Account",
      subscribedToNewsletter: false,
    });
  });

  it("returns null when the payload has no name fields, rather than falling back to blank names", async () => {
    await saveMalformedSignupEvent("11111111-1111-1111-1111-111111111111", {
      userId: ALICE_USER_ID,
      userEmail: "alice@example.com",
      subscribedToNewsletter: true,
    });

    const result = await query.findByUserId(ALICE_USER_ID);

    assert.strictEqual(result, null);
  });

  it("returns null when a name field has the wrong type", async () => {
    await saveMalformedSignupEvent("11111111-1111-1111-1111-111111111111", {
      userId: ALICE_USER_ID,
      userEmail: "alice@example.com",
      userFirstName: 42,
      userLastName: "Martin",
      subscribedToNewsletter: true,
    });

    const result = await query.findByUserId(ALICE_USER_ID);

    assert.strictEqual(result, null);
  });

  it("returns null when subscribedToNewsletter is missing", async () => {
    await saveMalformedSignupEvent("11111111-1111-1111-1111-111111111111", {
      userId: ALICE_USER_ID,
      userEmail: "alice@example.com",
      userFirstName: "Alice",
      userLastName: "Martin",
    });

    const result = await query.findByUserId(ALICE_USER_ID);

    assert.strictEqual(result, null);
  });
});
