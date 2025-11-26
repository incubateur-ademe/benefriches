// oxlint-disable no-non-null-assertion
import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import type { SiteAction } from "src/site-actions/core/models/siteAction";

import { SqlSiteActionsRepository } from "./SqlSiteActionsRepository";

describe("SqlSiteActionsRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlSiteActionsRepository;
  const now = new Date();

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    repository = new SqlSiteActionsRepository(sqlConnection);
    await sqlConnection("site_actions").del();
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

  describe("save", () => {
    it("should save site actions to database", async () => {
      const siteId = await insertSiteInDb();

      const actions: SiteAction[] = [
        {
          id: uuid(),
          siteId,
          actionType: "EVALUATE_COMPATIBILITY",
          status: "todo",
          createdAt: now,
        },
        {
          id: uuid(),
          siteId,
          actionType: "REQUEST_FUNDING_INFORMATION",
          status: "todo",
          createdAt: now,
        },
      ];

      await repository.save(actions);

      const savedActions = await sqlConnection("site_actions").select("*");
      expect(savedActions).toHaveLength(2);
      expect(savedActions).toEqual([
        {
          id: actions[0]!.id,
          site_id: siteId,
          action_type: "EVALUATE_COMPATIBILITY",
          status: "todo",
          created_at: now,
          completed_at: null,
        },
        {
          id: actions[1]!.id,
          site_id: siteId,
          action_type: "REQUEST_FUNDING_INFORMATION",
          status: "todo",
          created_at: now,
          completed_at: null,
        },
      ]);
    });

    it("should save action with completedAt", async () => {
      const siteId = await insertSiteInDb();
      const completedAt = new Date(now.getTime() + 1000);

      const action: SiteAction = {
        id: uuid(),
        siteId,
        actionType: "EVALUATE_COMPATIBILITY",
        status: "done",
        createdAt: now,
        completedAt,
      };

      await repository.save([action]);

      const savedAction = await sqlConnection("site_actions").select("*").first();
      expect(savedAction).toEqual({
        id: action.id,
        site_id: siteId,
        action_type: "EVALUATE_COMPATIBILITY",
        status: "done",
        created_at: now,
        completed_at: completedAt,
      });
    });
  });

  describe("updateStatus", () => {
    it("should update action status to done", async () => {
      const siteId = await insertSiteInDb();
      const actionId = uuid();
      const completedAt = new Date(now.getTime() + 1000);

      await sqlConnection("site_actions").insert({
        id: actionId,
        site_id: siteId,
        action_type: "EVALUATE_COMPATIBILITY",
        status: "todo",
        created_at: now,
        completed_at: null,
      });

      await repository.updateStatus({
        siteId,
        actionType: "EVALUATE_COMPATIBILITY",
        status: "done",
        completedAt,
      });

      const updatedAction = (await sqlConnection("site_actions").select("*").first())!;
      expect(updatedAction).toEqual({
        id: actionId,
        site_id: siteId,
        action_type: "EVALUATE_COMPATIBILITY",
        status: "done",
        created_at: now,
        completed_at: completedAt,
      });
    });

    it("should update action status to skipped", async () => {
      const siteId = await insertSiteInDb();
      const actionId = uuid();

      await sqlConnection("site_actions").insert({
        id: actionId,
        site_id: siteId,
        action_type: "REQUEST_FUNDING_INFORMATION",
        status: "todo",
        created_at: now,
        completed_at: null,
      });

      await repository.updateStatus({
        siteId,
        actionType: "REQUEST_FUNDING_INFORMATION",
        status: "skipped",
      });

      const updatedAction = (await sqlConnection("site_actions").select("*").first())!;
      expect(updatedAction.status).toEqual("skipped");
      expect(updatedAction.completed_at).toBeNull();
    });
  });
});
