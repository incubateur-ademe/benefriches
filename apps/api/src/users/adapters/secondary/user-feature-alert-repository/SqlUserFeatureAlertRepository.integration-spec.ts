import knex, { Knex } from "knex";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserFeatureAlert } from "src/users/core/usecases/createUserFeatureAlert.usecase";

import { SqlUserFeatureAlertRepository } from "./SqlUserFeatureAlertRepository";

describe("SqlUserFeatureAlertRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlUserFeatureAlertRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
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
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toEqual(featureAlert.id);
    expect(result[0]?.email).toEqual(featureAlert.email);
    expect(result[0]?.user_id).toEqual(featureAlert.userId);
    expect(result[0]?.feature_type).toEqual("duplicate_project");
    expect(result[0]?.feature_options).toEqual(null);
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
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toEqual(featureAlert.id);
    expect(result[0]?.email).toEqual(featureAlert.email);
    expect(result[0]?.user_id).toEqual(featureAlert.userId);
    expect(result[0]?.feature_type).toEqual("compare_impacts");
    expect(result[0]?.feature_options).toEqual(featureAlert.featureOptions);
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
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toEqual(featureAlert.id);
    expect(result[0]?.email).toEqual(featureAlert.email);
    expect(result[0]?.user_id).toEqual(featureAlert.userId);
    expect(result[0]?.feature_type).toEqual("export_impacts");
    expect(result[0]?.feature_options).toEqual(featureAlert.featureOptions);
  });
});
