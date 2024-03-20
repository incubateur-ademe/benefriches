import knex, { Knex } from "knex";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { buildExhaustiveUserProps, buildUser } from "src/users/domain/model/user.mock";
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

    const [result] = await sqlConnection("users").select().where({ id: user.id });
    expect(result.id).toEqual(user.id);
    expect(result.email).toEqual(user.email);
    expect(result.personal_data_storage_consented_at).toEqual(user.personalDataStorageConsentedAt);
    expect(result.firstname).toEqual(null);
    expect(result.lastname).toEqual(null);
    expect(result.structure_name).toEqual(null);
    expect(result.structure_type).toEqual(user.structureType);
    expect(result.structure_activity).toEqual(user.structureActivity);
    expect(result.personal_data_analytics_use_consented_at).toEqual(null);
    expect(result.personal_data_communication_use_consented_at).toEqual(null);
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
