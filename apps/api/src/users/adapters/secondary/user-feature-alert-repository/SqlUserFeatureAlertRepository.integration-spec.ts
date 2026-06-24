import type { Knex } from "knex";
import knex from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import type { UserFeatureAlert } from "src/users/core/usecases/createUserFeatureAlert.usecase";

import { SqlUserFeatureAlertRepository } from "./SqlUserFeatureAlertRepository";

describe("SqlUserFeatureAlertRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlUserFeatureAlertRepository;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlUserFeatureAlertRepository(sqlConnection);
  });

  it("Saves 'duplicate_project' user feature alert", async () => {
    await sqlConnection("users").insert({
      id: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      personal_data_storage_consented_at: new Date(),
      created_at: new Date(),
    });
    const featureAlert: UserFeatureAlert = {
      id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
      userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      featureType: "duplicate_project",
      createdAt: new Date(),
    };
    await repository.save(featureAlert);

    const result = await sqlConnection("users_feature_alerts")
      .select()
      .where({ id: featureAlert.id });
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0]?.id, featureAlert.id);
    assert.strictEqual(result[0]?.email, featureAlert.email);
    assert.strictEqual(result[0]?.user_id, featureAlert.userId);
    assert.strictEqual(result[0]?.feature_type, "duplicate_project");
    assert.strictEqual(result[0]?.feature_options, null);
  });

  it("Saves 'compare_impacts' user feature alert", async () => {
    await sqlConnection("users").insert({
      id: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      personal_data_storage_consented_at: new Date(),
      created_at: new Date(),
    });
    const featureAlert: UserFeatureAlert = {
      id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
      userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      featureType: "compare_impacts",
      featureOptions: {
        same_project_on_prairie: true,
        same_project_on_agricultural_operation: false,
        statu_quo_scenario: false,
      },
      createdAt: new Date(),
    };
    await repository.save(featureAlert);

    const result = await sqlConnection("users_feature_alerts")
      .select()
      .where({ id: featureAlert.id });
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0]?.id, featureAlert.id);
    assert.strictEqual(result[0]?.email, featureAlert.email);
    assert.strictEqual(result[0]?.user_id, featureAlert.userId);
    assert.strictEqual(result[0]?.feature_type, "compare_impacts");
    assert.deepStrictEqual(result[0]?.feature_options, featureAlert.featureOptions);
  });

  it("Saves 'export_impacts' user feature alert", async () => {
    await sqlConnection("users").insert({
      id: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      personal_data_storage_consented_at: new Date(),
      created_at: new Date(),
    });
    const featureAlert: UserFeatureAlert = {
      id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
      userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      featureType: "export_impacts",
      featureOptions: { pdf: true, excel: true, sharing_link: false },
      createdAt: new Date(),
    };
    await repository.save(featureAlert);

    const result = await sqlConnection("users_feature_alerts")
      .select()
      .where({ id: featureAlert.id });
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0]?.id, featureAlert.id);
    assert.strictEqual(result[0]?.email, featureAlert.email);
    assert.strictEqual(result[0]?.user_id, featureAlert.userId);
    assert.strictEqual(result[0]?.feature_type, "export_impacts");
    assert.deepStrictEqual(result[0]?.feature_options, featureAlert.featureOptions);
  });
});
