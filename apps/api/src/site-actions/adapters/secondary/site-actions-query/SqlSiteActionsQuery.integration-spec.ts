import type { Knex } from "knex";
import knex from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import type { SiteAction } from "src/site-actions/core/models/siteAction";

import { SqlSiteActionsQuery } from "./SqlSiteActionsQuery";

describe("SqlSiteActionsQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlSiteActionsQuery;
  const now = new Date();

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    query = new SqlSiteActionsQuery(sqlConnection);
  });

  const insertSiteInDb = async (): Promise<string> => {
    const siteId = uuid();
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: uuid(),
      name: "Test Site",
      surface_area: 1000,
      owner_structure_type: "municipality",
      created_at: now,
      creation_mode: "express",
      nature: "FRICHE",
    });
    return siteId;
  };

  describe("getBySiteId", () => {
    it("should return all site actions for a given site ordered by creation date", async () => {
      const siteId = await insertSiteInDb();

      const createdAt1 = new Date(now.getTime());
      const createdAt2 = new Date(now.getTime() + 1000);
      const createdAt3 = new Date(now.getTime() + 2000);

      const actionId1 = uuid();
      const actionId2 = uuid();
      const actionId3 = uuid();

      await sqlConnection("site_actions").insert([
        {
          id: actionId2,
          site_id: siteId,
          action_type: "REQUEST_FUNDING_INFORMATION",
          status: "todo",
          created_at: createdAt2,
          completed_at: null,
        },
        {
          id: actionId1,
          site_id: siteId,
          action_type: "EVALUATE_COMPATIBILITY",
          status: "todo",
          created_at: createdAt1,
          completed_at: null,
        },
        {
          id: actionId3,
          site_id: siteId,
          action_type: "REFERENCE_SITE_ON_CARTOFRICHES",
          status: "done",
          created_at: createdAt3,
          completed_at: new Date(createdAt3.getTime() + 1000),
        },
      ]);

      const result = await query.getBySiteId(siteId);

      assert.strictEqual(result.length, 3);
      const expected = [
        {
          id: actionId1,
          siteId,
          actionType: "EVALUATE_COMPATIBILITY",
          status: "todo",
          createdAt: createdAt1,
          completedAt: undefined,
        },
        {
          id: actionId2,
          siteId,
          actionType: "REQUEST_FUNDING_INFORMATION",
          status: "todo",
          createdAt: createdAt2,
          completedAt: undefined,
        },
        {
          id: actionId3,
          siteId,
          actionType: "REFERENCE_SITE_ON_CARTOFRICHES",
          status: "done",
          createdAt: createdAt3,
          completedAt: new Date(createdAt3.getTime() + 1000),
        },
      ] satisfies SiteAction[];
      assert.deepStrictEqual(result, expected);
    });

    it("should return empty array when no actions exist for site", async () => {
      const siteId = await insertSiteInDb();

      const result = await query.getBySiteId(siteId);

      assert.deepStrictEqual(result, []);
    });

    it("should not return actions from other sites", async () => {
      const siteId1 = await insertSiteInDb();
      const siteId2 = await insertSiteInDb();

      await sqlConnection("site_actions").insert({
        id: uuid(),
        site_id: siteId2,
        action_type: "EVALUATE_COMPATIBILITY",
        status: "todo",
        created_at: now,
        completed_at: null,
      });

      const result = await query.getBySiteId(siteId1);

      assert.deepStrictEqual(result, []);
    });
  });
});
