import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlUserQuery } from "./SqlUserQuery";

describe("SqlUserQuery integration", () => {
  let sqlConnection: Knex;
  let userQuery: SqlUserQuery;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    userQuery = new SqlUserQuery(sqlConnection);
  });

  describe("getById", () => {
    it("get user with structure", async () => {
      const id = uuid();
      await sqlConnection("users").insert({
        id,
        email: "user@test.fr",
        created_at: new Date(),
        structure_activity: "municipality",
        structure_type: "local_authority",
        structure_name: "Mairie de Blajan",
        personal_data_analytics_use_consented_at: new Date(),
        personal_data_communication_use_consented_at: new Date(),
        personal_data_storage_consented_at: new Date(),
      });
      const result = await userQuery.getById(id);

      expect(result).toEqual({
        id,
        structure: {
          activity: "municipality",
          type: "local_authority",
          name: "Mairie de Blajan",
        },
      });
    });
    it("returns undefined if user doesn't exist", async () => {
      const id = uuid();
      const result = await userQuery.getById(id);

      expect(result).toEqual(undefined);
    });
  });
});
