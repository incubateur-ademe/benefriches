import knex, { Knex } from "knex";
import {
  buildExhaustiveIdentityProps,
  buildIdentity,
} from "src/identities/domain/model/identity.mock";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlIdentityRepository } from "./SqlIdentityRepository";

describe("SqlSiteRepository integration", () => {
  let sqlConnection: Knex;
  let identityRepository: SqlIdentityRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    identityRepository = new SqlIdentityRepository(sqlConnection);
  });

  it("Saves identity with minimal required props", async () => {
    const identity = buildIdentity();

    await identityRepository.save(identity);

    const [result] = await sqlConnection("identities").select().where({ id: identity.id });
    expect(result.id).toEqual(identity.id);
    expect(result.email).toEqual(identity.email);
    expect(result.personal_data_storage_consented_at).toEqual(
      identity.personalDataStorageConsentedAt,
    );
    expect(result.firstname).toEqual(null);
    expect(result.lastname).toEqual(null);
    expect(result.structure_name).toEqual(null);
    expect(result.structure_type).toEqual(null);
    expect(result.personal_data_analytics_use_consented_at).toEqual(null);
    expect(result.personal_data_communication_use_consented_at).toEqual(null);
  });

  it("Saves identity with full props", async () => {
    const identity = buildIdentity(buildExhaustiveIdentityProps());

    await identityRepository.save(identity);

    const [result] = await sqlConnection("identities").select().where({ id: identity.id });
    expect(result).toEqual({
      id: identity.id,
      email: identity.email,
      personal_data_storage_consented_at: identity.personalDataStorageConsentedAt,
      firstname: identity.firstname,
      lastname: identity.lastname,
      created_at: identity.createdAt,
      structure_name: identity.structureName,
      structure_type: identity.structureType,
      personal_data_analytics_use_consented_at:
        identity.personalDataAnalyticsUseConsentedAt ?? null,
      personal_data_communication_use_consented_at:
        identity.personalDataCommunicationUseConsentedAt ?? null,
    });
  });
});
