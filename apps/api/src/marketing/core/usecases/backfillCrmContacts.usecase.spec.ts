import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FakeCrm } from "src/marketing/adapters/secondary/FakeCrm";
import { InMemoryUserSignupIntentQuery } from "src/marketing/adapters/secondary/signup-intent-query/InMemoryUserSignupIntentQuery";
import { InMemoryMarketingUsersQuery } from "src/marketing/adapters/secondary/users-query/InMemoryMarketingUsersQuery";
import { SpyLogger } from "src/shared-kernel/adapters/logger/SpyLogger";
import type { SuccessResult, TResult } from "src/shared-kernel/result";

import {
  BACKFILL_CANDIDATE_SINCE_DATE,
  BackfillCrmContactsUseCase,
} from "./backfillCrmContacts.usecase";

const getSuccessData = <TData>(result: TResult<TData, never>): TData =>
  (result as SuccessResult<TData>).getData();

const DURING_OUTAGE = new Date("2026-07-01T10:00:00.000Z");
const BEFORE_OUTAGE = new Date("2026-05-01T10:00:00.000Z");

const setup = () => {
  const usersQuery = new InMemoryMarketingUsersQuery();
  const signupIntentQuery = new InMemoryUserSignupIntentQuery();
  const crm = new FakeCrm();
  const logger = new SpyLogger();
  // No-op sleep: tests exercise the retry logic without waiting real time.
  const sleep = () => Promise.resolve();
  const usecase = new BackfillCrmContactsUseCase(usersQuery, signupIntentQuery, crm, logger, sleep);
  return { usecase, usersQuery, signupIntentQuery, crm, logger };
};

describe("BackfillCrmContacts Use case", () => {
  it("returns a zero-counter summary when there is no candidate user", async () => {
    const { usecase, crm } = setup();

    const result = await usecase.execute({ dryRun: false });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 0,
      alreadyInCrm: 0,
      backfilled: 0,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(crm._newContacts, []);
  });

  it("creates the CRM contact from the signup intent for a user missing in CRM", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      {
        id: "u1",
        email: "a@b.fr",
        subscribedToNewsletter: false,
        createdAt: DURING_OUTAGE,
      },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 1,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(crm._newContacts, [
      {
        email: "a@b.fr",
        firstName: "Alice",
        lastName: "Martin",
        subscribedToNewsletter: true,
      },
    ]);
  });

  it("uses the signup intent, not the possibly corrupted subscription column", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      {
        id: "u1",
        email: "a@b.fr",
        // Column wrongly flipped to false by the sync job while the CRM outage lasted.
        subscribedToNewsletter: false,
        createdAt: DURING_OUTAGE,
      },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });

    await usecase.execute({ dryRun: false });

    assert.strictEqual(crm._newContacts[0]?.subscribedToNewsletter, true);
  });

  it("looks up the signup intent by user id, not by email", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      { id: "u2", email: "reused@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    // Intent of an older, deleted account that once used the same email address.
    signupIntentQuery._setIntent("u1", {
      firstName: "Old",
      lastName: "Account",
      subscribedToNewsletter: true,
    });
    signupIntentQuery._setIntent("u2", {
      firstName: "New",
      lastName: "Account",
      subscribedToNewsletter: false,
    });

    await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(crm._newContacts, [
      {
        email: "reused@b.fr",
        firstName: "New",
        lastName: "Account",
        subscribedToNewsletter: false,
      },
    ]);
  });

  it("ignores users created before the candidate window starts", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "old@b.fr", subscribedToNewsletter: true, createdAt: BEFORE_OUTAGE },
      { id: "u2", email: "new@b.fr", subscribedToNewsletter: true, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Old",
      lastName: "User",
      subscribedToNewsletter: true,
    });
    signupIntentQuery._setIntent("u2", {
      firstName: "New",
      lastName: "User",
      subscribedToNewsletter: true,
    });

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 1,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(
      crm._newContacts.map((contact) => contact.email),
      ["new@b.fr"],
    );
  });

  it("includes a user created exactly on the candidate window boundary", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      {
        id: "u1",
        email: "a@b.fr",
        subscribedToNewsletter: true,
        createdAt: BACKFILL_CANDIDATE_SINCE_DATE,
      },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 1,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
    assert.strictEqual(crm._newContacts.length, 1);
  });

  it("starts the candidate window a safety margin before the confirmed bug start date", () => {
    assert.strictEqual(
      BACKFILL_CANDIDATE_SINCE_DATE.toISOString(),
      "2026-06-01T00:00:00.000Z",
      "widening this window is safe (pre-outage users are skipped as alreadyInCrm); narrowing it risks never backfilling a real outage-window user",
    );
  });

  it("skips a user who already has a CRM contact without creating a duplicate", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });
    crm._setContact("a@b.fr", false);

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 1,
      backfilled: 0,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(crm._newContacts, []);
  });

  it("is idempotent: a second run finds the contact it created and creates no duplicate", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });

    const firstRun = await usecase.execute({ dryRun: false });
    const secondRun = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(firstRun), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 1,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(getSuccessData(secondRun), {
      totalCandidates: 1,
      alreadyInCrm: 1,
      backfilled: 0,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(crm._newContacts, [
      {
        email: "a@b.fr",
        firstName: "Alice",
        lastName: "Martin",
        subscribedToNewsletter: true,
      },
    ]);
  });

  it("skips and warns when no signup event is found, counting it as an error", async () => {
    const { usecase, usersQuery, crm, logger } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 0,
      missingSignupEvent: 1,
      errored: 1,
      dryRun: false,
    });
    assert.deepStrictEqual(crm._newContacts, []);
    assert.strictEqual(logger._warn.length, 1);
    assert.ok(logger._warn[0]?.message.includes("a@b.fr"));
    assert.ok(logger._warn[0]?.message.includes("u1"));
  });

  it("logs and counts errored when the CRM lookup throws for a user", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm, logger } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });
    const crmError = new Error("boom");
    crm._setEmailError("a@b.fr", crmError);

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 0,
      missingSignupEvent: 0,
      errored: 1,
      dryRun: false,
    });
    assert.deepStrictEqual(crm._newContacts, []);
    assert.strictEqual(logger._error.length, 1);
    assert.ok(logger._error[0]?.message.includes("a@b.fr"));
    assert.ok(logger._error[0]?.message.includes("u1"));
    assert.strictEqual(logger._error[0]?.error, crmError);
  });

  it("does not abort when one user errors; continues with the remaining users", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "boom@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
      { id: "u2", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
      { id: "u3", email: "known@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
      { id: "u4", email: "noevent@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    crm._setEmailError("boom@b.fr");
    signupIntentQuery._setIntent("u2", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });
    crm._setContact("known@b.fr", true);

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 4,
      alreadyInCrm: 1,
      backfilled: 1,
      missingSignupEvent: 1,
      errored: 2,
      dryRun: false,
    });
    assert.deepStrictEqual(
      crm._newContacts.map((contact) => contact.email),
      ["a@b.fr"],
    );
  });

  it("dry-run: never writes to the CRM, counters identical to a real run, logs prefixed [DRY RUN]", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm, logger } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });

    const result = await usecase.execute({ dryRun: true });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 1,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: true,
    });
    assert.deepStrictEqual(crm._newContacts, []);
    assert.strictEqual(
      logger._info.every((line) => line.includes("[DRY RUN]")),
      true,
    );
    assert.strictEqual(
      logger._info.some((line) => line.includes("backfill summary")),
      true,
    );
  });

  it("defaults to a real run (dryRun=false) when no request is provided", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 1,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
    assert.strictEqual(crm._newContacts.length, 1);
  });

  it("emits a final info summary log line with all counters and a duration", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm, logger } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
      { id: "u2", email: "known@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });
    crm._setContact("known@b.fr", true);

    await usecase.execute({ dryRun: false });

    const summaryLine = logger._info.find((line) => line.includes("backfill summary")) ?? "";
    assert.ok(summaryLine.includes("total=2"));
    assert.ok(summaryLine.includes("alreadyInCrm=1"));
    assert.ok(summaryLine.includes("backfilled=1"));
    assert.ok(summaryLine.includes("missingSignupEvent=0"));
    assert.ok(summaryLine.includes("errored=0"));
    assert.match(summaryLine, /durationMs=\d+/);
    assert.ok(!summaryLine.includes("[DRY RUN]"));
  });

  it("counts as errored when createContact reports success but the contact never becomes retrievable", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm, logger } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });
    crm._setContactWontPersist("a@b.fr");

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 0,
      missingSignupEvent: 0,
      errored: 1,
      dryRun: false,
    });
    assert.strictEqual(logger._error.length, 1);
    assert.ok(logger._error[0]?.message.includes("a@b.fr"));
  });

  it("counts as backfilled when the contact becomes retrievable only after a few verification retries", async () => {
    const { usecase, usersQuery, signupIntentQuery, crm } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false, createdAt: DURING_OUTAGE },
    ]);
    signupIntentQuery._setIntent("u1", {
      firstName: "Alice",
      lastName: "Martin",
      subscribedToNewsletter: true,
    });
    crm._setContactWontPersist("a@b.fr");
    const originalFindContactByEmail = crm.findContactByEmail.bind(crm);
    let callCount = 0;
    crm.findContactByEmail = (email: string) => {
      callCount++;
      if (email === "a@b.fr" && callCount >= 3) {
        crm._setContact("a@b.fr", true);
      }
      return originalFindContactByEmail(email);
    };

    const result = await usecase.execute({ dryRun: false });

    assert.deepStrictEqual(getSuccessData(result), {
      totalCandidates: 1,
      alreadyInCrm: 0,
      backfilled: 1,
      missingSignupEvent: 0,
      errored: 0,
      dryRun: false,
    });
  });

  it("emits an info log line naming the candidate window start date when the backfill starts", async () => {
    const { usecase, logger } = setup();

    await usecase.execute({ dryRun: false });

    const startLine = logger._info.find((line) => line.includes("backfill started")) ?? "";
    assert.ok(startLine.includes(BACKFILL_CANDIDATE_SINCE_DATE.toISOString()));
    assert.ok(!startLine.includes("[DRY RUN]"));
  });
});
