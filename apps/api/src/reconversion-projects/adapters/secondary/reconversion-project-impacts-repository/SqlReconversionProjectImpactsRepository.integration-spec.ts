import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { ReconversionProjectImpactsDataView } from "src/reconversion-projects/domain/usecases/computeReconversionProjectImpacts.usecase";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlReconversionProjectImpactsRepository } from "./SqlReconversionProjectImpactsRepository";

describe("SqlReconversionProjectImpactsRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlReconversionProjectImpactsRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlReconversionProjectImpactsRepository(sqlConnection);
  });

  describe("getById", () => {
    it("gets reconversion project with ALL data needed for impact computation", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "9b3a4906-1db2-441d-97d5-7be287add907",
        name: "Site name",
        surface_area: 14000,
        is_friche: false,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Big project",
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        related_site_id: siteId,
        created_at: new Date(),
        conversion_full_time_jobs_involved: 20,
        reinstatement_full_time_jobs_involved: 5,
        future_operations_full_time_jobs: 0.2,
        reinstatement_schedule_start_date: new Date("2024-07-01"),
        reinstatement_schedule_end_date: new Date("2024-12-31"),
      });

      await sqlConnection("reconversion_project_soils_distributions").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "BUILDINGS",
          surface_area: 1200,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 30000,
        },
      ]);
      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          schedule_start_date: new Date("2025-01-01"),
          schedule_end_date: new Date("2025-05-15"),
          type: "any",
          features: {},
        },
      ]);

      const result = await repository.getById(reconversionProjectId);

      expect(result).toEqual<Required<ReconversionProjectImpactsDataView>>({
        id: reconversionProjectId,
        name: "Big project",
        relatedSiteId: siteId,
        soilsDistribution: {
          BUILDINGS: 1200,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 30000,
        },
        operationsFullTimeJobs: 0.2,
        conversionFullTimeJobs: 20,
        conversionSchedule: {
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-05-15"),
        },
        reinstatementFullTimeJobs: 5,
        reinstatementSchedule: {
          startDate: new Date("2024-07-01"),
          endDate: new Date("2024-12-31"),
        },
      });
    });
    it("gets reconversion project when optional data does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "9b3a4906-1db2-441d-97d5-7be287add907",
        name: "Site name",
        surface_area: 14000,
        is_friche: false,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Big project",
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        related_site_id: siteId,
        created_at: new Date(),
      });

      await sqlConnection("reconversion_project_soils_distributions").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "BUILDINGS",
          surface_area: 1200,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 30000,
        },
      ]);
      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          type: "any",
          features: {},
        },
      ]);

      const result = await repository.getById(reconversionProjectId);

      expect(result).toEqual<ReconversionProjectImpactsDataView>({
        id: reconversionProjectId,
        name: "Big project",
        relatedSiteId: siteId,
        soilsDistribution: {
          BUILDINGS: 1200,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 30000,
        },
      });
    });
  });
});
