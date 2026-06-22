import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FakeCrm } from "src/marketing/adapters/secondary/FakeCrm";
import { InMemoryMarketingUsersQuery } from "src/marketing/adapters/secondary/users-query/InMemoryMarketingUsersQuery";
import { InMemoryMarketingUsersRepository } from "src/marketing/adapters/secondary/users-repository/InMemoryMarketingUsersRepository";
import { SpyLogger } from "src/shared-kernel/adapters/logger/SpyLogger";
import type { SuccessResult, TResult } from "src/shared-kernel/result";

import { SyncNewsletterSubscriptionsUseCase } from "./syncNewsletterSubscriptions.usecase";

// Scenarios are defined in docs/specs/2026-05-04-newsletter-subscription-sync.md
// (section "Scenarios (one unit test per row)").

const getSuccessData = <TData>(result: TResult<TData, never>): TData =>
  (result as SuccessResult<TData>).getData();

const setup = () => {
  const usersQuery = new InMemoryMarketingUsersQuery();
  const usersRepository = new InMemoryMarketingUsersRepository();
  const crm = new FakeCrm();
  const logger = new SpyLogger();
  const usecase = new SyncNewsletterSubscriptionsUseCase(usersQuery, usersRepository, crm, logger);
  return { usecase, usersQuery, usersRepository, crm, logger };
};

describe("SyncNewsletterSubscriptions Use case", () => {
  it("defaults to a real run (dryRun=false) when no request is provided", async () => {
    const { usecase, usersQuery, usersRepository, crm } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: false }]);
    crm._setContact("a@b.fr", true);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 1,
      unchanged: 0,
      missingInCrm: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, [{ userId: "u1", subscribed: true }]);
  });

  // Scenario 9: zero users in DB → no CRM calls, all-zero summary
  it("returns a zero-counter summary when there are no users (no CRM calls)", async () => {
    const { usecase, crm } = setup();

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 0,
      updated: 0,
      unchanged: 0,
      missingInCrm: 0,
      errored: 0,
      dryRun: false,
    });
    assert.strictEqual(crm._contacts.size, 0);
  });

  // Scenario 1: DB=false, CRM found, CRM subscribed=true → updated to true
  it("updates the column to true when DB is false and CRM is true", async () => {
    const { usecase, usersQuery, usersRepository, crm } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: false }]);
    crm._setContact("a@b.fr", true);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 1,
      unchanged: 0,
      missingInCrm: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, [{ userId: "u1", subscribed: true }]);
  });

  // Scenario 2: DB=true, CRM found, CRM subscribed=false → updated to false
  it("updates the column to false when DB is true and CRM is false", async () => {
    const { usecase, usersQuery, usersRepository, crm } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: true }]);
    crm._setContact("a@b.fr", false);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 1,
      unchanged: 0,
      missingInCrm: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, [{ userId: "u1", subscribed: false }]);
  });

  // Scenario 3: DB=true, CRM found, CRM subscribed=true → unchanged, no write
  it("does not write when DB is true and CRM is true (unchanged)", async () => {
    const { usecase, usersQuery, usersRepository, crm } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: true }]);
    crm._setContact("a@b.fr", true);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 0,
      unchanged: 1,
      missingInCrm: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, []);
  });

  // Scenario 4: DB=false, CRM found, CRM subscribed=false → unchanged, no write
  it("does not write when DB is false and CRM is false (unchanged)", async () => {
    const { usecase, usersQuery, usersRepository, crm } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: false }]);
    crm._setContact("a@b.fr", false);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 0,
      unchanged: 1,
      missingInCrm: 0,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, []);
  });

  // Scenario 5: DB=true, contact missing in CRM → set false + warn (missingInCrm)
  it("sets to false and warns when DB is true but contact is missing in CRM", async () => {
    const { usecase, usersQuery, usersRepository, logger } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: true }]);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 0,
      unchanged: 0,
      missingInCrm: 1,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, [{ userId: "u1", subscribed: false }]);
    assert.strictEqual(logger._warn.length, 1);
    assert.ok(logger._warn[0]?.message.includes("a@b.fr"));
    assert.ok(logger._warn[0]?.message.includes("u1"));
  });

  // Scenario 6: DB=false, contact missing in CRM → no write + warn (missingInCrm)
  it("does not write but warns when DB is false and contact is missing in CRM", async () => {
    const { usecase, usersQuery, usersRepository, logger } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: false }]);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 0,
      unchanged: 0,
      missingInCrm: 1,
      errored: 0,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, []);
    assert.strictEqual(logger._warn.length, 1);
    assert.ok(logger._warn[0]?.message.includes("a@b.fr"));
    assert.ok(logger._warn[0]?.message.includes("u1"));
  });

  // Scenario 7: CRM call fails for a user → no write, errored++, error log with email + userId
  it("logs and counts errored when CRM throws for a user", async () => {
    const { usecase, usersQuery, usersRepository, crm, logger } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: false }]);
    const crmError = new Error("boom");
    crm._setEmailError("a@b.fr", crmError);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 0,
      unchanged: 0,
      missingInCrm: 0,
      errored: 1,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, []);
    assert.strictEqual(logger._error.length, 1);
    assert.ok(logger._error[0]?.message.includes("a@b.fr"));
    assert.ok(logger._error[0]?.message.includes("u1"));
    assert.strictEqual(logger._error[0]?.error, crmError);
  });

  // Scenario 10: one user errors, others succeed → run completes, errored counted, others processed
  it("does not abort when one user errors; continues with the remaining users", async () => {
    const { usecase, usersQuery, usersRepository, crm } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false },
      { id: "u2", email: "boom@b.fr", subscribedToNewsletter: true },
      { id: "u3", email: "c@b.fr", subscribedToNewsletter: false },
    ]);
    crm._setContact("a@b.fr", true);
    crm._setEmailError("boom@b.fr");
    crm._setContact("c@b.fr", false);

    const result = await usecase.execute();

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 3,
      updated: 1,
      unchanged: 1,
      missingInCrm: 0,
      errored: 1,
      dryRun: false,
    });
    assert.deepStrictEqual(usersRepository._updates, [{ userId: "u1", subscribed: true }]);
  });

  // Scenario 8: end of run → final info log line summarizing all counters
  it("emits a final info summary log line with all counters and a duration", async () => {
    const { usecase, usersQuery, crm, logger } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false },
      { id: "u2", email: "c@b.fr", subscribedToNewsletter: true },
    ]);
    crm._setContact("a@b.fr", true);
    crm._setContact("c@b.fr", true);

    await usecase.execute();

    const summaryLine = logger._info.find((line) => line.includes("sync summary")) ?? "";
    assert.ok(summaryLine.includes("total=2"));
    assert.ok(summaryLine.includes("updated=1"));
    assert.ok(summaryLine.includes("unchanged=1"));
    assert.ok(summaryLine.includes("missingInCrm=0"));
    assert.ok(summaryLine.includes("errored=0"));
    assert.match(summaryLine, /durationMs=\d+/);
    assert.ok(!summaryLine.includes("[DRY RUN]"));
  });

  // Logs the start of the run with a single info line
  it("emits an info log line when the sync starts", async () => {
    const { usecase, logger } = setup();

    await usecase.execute();

    const startLine = logger._info.find((line) => line.includes("sync started")) ?? "";
    assert.ok(startLine.includes("Newsletter subscription sync started"));
    assert.ok(!startLine.includes("[DRY RUN]"));
  });

  // Logs every drifted email with both the DB value and the CRM value
  it("logs an info line per drifted email with db and crm values", async () => {
    const { usecase, usersQuery, crm, logger } = setup();
    usersQuery._setUsers([
      { id: "u1", email: "a@b.fr", subscribedToNewsletter: false },
      { id: "u2", email: "c@b.fr", subscribedToNewsletter: true },
      { id: "u3", email: "d@b.fr", subscribedToNewsletter: true },
    ]);
    crm._setContact("a@b.fr", true);
    crm._setContact("c@b.fr", false);
    crm._setContact("d@b.fr", true);

    await usecase.execute();

    const driftLines = logger._info.filter((line) => line.includes("Drift detected"));
    assert.strictEqual(driftLines.length, 2);
    assert.ok(driftLines.some((l) => l.includes("email=a@b.fr, db=false, crm=true")));
    assert.ok(driftLines.some((l) => l.includes("email=c@b.fr, db=true, crm=false")));
  });

  // Scenario 11: dry-run with drift → counters as if real, no writes, summary prefixed [DRY RUN]
  it("dry-run: never writes, counters identical to a real run, summary log prefixed [DRY RUN]", async () => {
    const { usecase, usersQuery, usersRepository, crm, logger } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: false }]);
    crm._setContact("a@b.fr", true);

    const result = await usecase.execute({ dryRun: true });

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 1,
      unchanged: 0,
      missingInCrm: 0,
      errored: 0,
      dryRun: true,
    });
    assert.deepStrictEqual(usersRepository._updates, []);
    assert.strictEqual(
      logger._info.every((line) => line.includes("[DRY RUN]")),
      true,
    );
    assert.strictEqual(
      logger._info.some((line) => line.includes("sync summary")),
      true,
    );
  });

  // Scenario 11 (missing-in-CRM variant): dry-run, DB=true, contact missing → no write, [DRY RUN] summary
  it("dry-run: does not write when DB is true and contact is missing in CRM", async () => {
    const { usecase, usersQuery, usersRepository, logger } = setup();
    usersQuery._setUsers([{ id: "u1", email: "a@b.fr", subscribedToNewsletter: true }]);

    const result = await usecase.execute({ dryRun: true });

    assert.deepStrictEqual(getSuccessData(result), {
      totalUsers: 1,
      updated: 0,
      unchanged: 0,
      missingInCrm: 1,
      errored: 0,
      dryRun: true,
    });
    assert.deepStrictEqual(usersRepository._updates, []);
    assert.strictEqual(
      logger._info.every((line) => line.includes("[DRY RUN]")),
      true,
    );
    assert.strictEqual(
      logger._info.some((line) => line.includes("sync summary")),
      true,
    );
  });
});
