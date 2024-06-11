import knex, { Knex } from "knex";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { buildExhaustiveUserProps, buildUser } from "src/users/core/model/user.mock";
import { SqlUserRepository } from "./SqlUserRepository";

describe("SqlSiteRepository integration", () => {
  let sqlConnection: Knex;
  let userRepository: SqlUserRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    userRepository = new SqlUserRepository(sqlConnection);
  });

  it("Saves user with minimal required props", async () => {
    const user = buildUser();

    await userRepository.save(user);

    const result = await sqlConnection("users").select().where({ id: user.id });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toEqual(user.id);
    expect(result[0]?.email).toEqual(user.email);
    expect(result[0]?.personal_data_storage_consented_at).toEqual(
      user.personalDataStorageConsentedAt,
    );
    expect(result[0]?.firstname).toEqual(null);
    expect(result[0]?.lastname).toEqual(null);
    expect(result[0]?.structure_name).toEqual(null);
    expect(result[0]?.structure_type).toEqual(user.structureType);
    expect(result[0]?.structure_activity).toEqual(user.structureActivity);
    expect(result[0]?.personal_data_analytics_use_consented_at).toEqual(null);
    expect(result[0]?.personal_data_communication_use_consented_at).toEqual(null);
  });

  it("Saves user with full props", async () => {
    const user = buildUser(buildExhaustiveUserProps());

    await userRepository.save(user);

    const [result] = await sqlConnection("users").select().where({ id: user.id });
    expect(result).toEqual({
      id: user.id,
      email: user.email,
      personal_data_storage_consented_at: user.personalDataStorageConsentedAt,
      firstname: user.firstname,
      lastname: user.lastname,
      created_at: user.createdAt,
      structure_name: user.structureName,
      structure_type: user.structureType,
      structure_activity: user.structureActivity,
      personal_data_analytics_use_consented_at: user.personalDataAnalyticsUseConsentedAt ?? null,
      personal_data_communication_use_consented_at:
        user.personalDataCommunicationUseConsentedAt ?? null,
    });
  });
});
