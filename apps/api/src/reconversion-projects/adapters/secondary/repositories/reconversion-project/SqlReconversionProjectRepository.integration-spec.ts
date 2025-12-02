import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";

import {
  ReconversionProjectSaveDto,
  ReconversionProjectUpdateDto,
} from "src/reconversion-projects/core/model/reconversionProject";
import {
  buildExhaustiveReconversionProjectProps,
  buildReconversionProject,
  UrbanProjectBuilder,
} from "src/reconversion-projects/core/model/reconversionProject.mock";
import { UrbanProjectFeatures } from "src/reconversion-projects/core/model/urbanProjects";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlReconversionProjectRepository } from "./SqlReconversionProjectRepository";

describe("SqlReconversionProjectRepository integration", () => {
  let sqlConnection: Knex;
  let reconversionProjectRepository: SqlReconversionProjectRepository;
  const now = new Date();
  const updatedAt = new Date(now.getTime() + 1000);

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    reconversionProjectRepository = new SqlReconversionProjectRepository(sqlConnection);
  });

  const insertSiteInDb = async (): Promise<string> => {
    const siteId = uuid();
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: "9b3a4906-1db2-441d-97d5-7be287add907",
      name: "Site name",
      surface_area: 14000,
      owner_structure_type: "company",
      created_at: now,
    });
    return siteId;
  };

  describe("existsWithId", () => {
    it("Tells when reconversion project exists with id", async () => {
      const siteId = await insertSiteInDb();
      const reconversionProjectId = uuid();
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Centrale pv",
        related_site_id: siteId,
        created_at: now,
      });
      const result = await reconversionProjectRepository.existsWithId(reconversionProjectId);
      expect(result).toEqual(true);
    });

    it("Tells when reconversion project does not exist with id", async () => {
      const reconversionProjectId = uuid();
      const result = await reconversionProjectRepository.existsWithId(reconversionProjectId);
      expect(result).toEqual(false);
    });
  });

  describe("save", () => {
    describe("Photovoltaic power plant development plan", () => {
      it("Saves given reconversion project with minimal data in table reconversion_projects", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = buildReconversionProject({
          createdAt: now,
          relatedSiteId: siteId,
        });

        await reconversionProjectRepository.save(reconversionProject);

        const result = await sqlConnection("reconversion_projects").select("*");
        expect(result).toEqual([
          {
            id: reconversionProject.id,
            created_by: reconversionProject.createdBy,
            creation_mode: reconversionProject.creationMode,
            name: reconversionProject.name,
            related_site_id: siteId,
            created_at: now,
            updated_at: null,
            description: null,
            future_operator_name: null,
            future_operator_structure_type: null,
            future_site_owner_name: null,
            future_site_owner_structure_type: null,
            reinstatement_contract_owner_name: null,
            reinstatement_contract_owner_structure_type: null,
            site_purchase_selling_price: null,
            site_purchase_property_transfer_duties: null,
            reinstatement_schedule_start_date: null,
            reinstatement_schedule_end_date: null,
            operations_first_year: null,
            project_phase: reconversionProject.projectPhase,
            site_resale_expected_selling_price: null,
            site_resale_expected_property_transfer_duties: null,
            buildings_resale_expected_selling_price: null,
            buildings_resale_expected_property_transfer_duties: null,
            friche_decontaminated_soil_surface_area: null,
          },
        ]);
      });

      describe("Given reconversion project with exhaustive data", () => {
        it("Saves in table reconversion_projects", async () => {
          const siteId = await insertSiteInDb();
          const reconversionProject = buildReconversionProject({
            ...buildExhaustiveReconversionProjectProps(),
            createdAt: now,
            relatedSiteId: siteId,
          });
          await reconversionProjectRepository.save(reconversionProject);

          const result = await sqlConnection("reconversion_projects").select("*");
          expect(result).toEqual([
            {
              id: reconversionProject.id,
              created_by: reconversionProject.createdBy,
              name: reconversionProject.name,
              related_site_id: siteId,
              created_at: now,
              updated_at: null,
              creation_mode: reconversionProject.creationMode,
              description: reconversionProject.description,
              future_operator_name: reconversionProject.futureOperator?.name,
              future_operator_structure_type: reconversionProject.futureOperator?.structureType,
              future_site_owner_name: reconversionProject.futureSiteOwner?.name,
              future_site_owner_structure_type: reconversionProject.futureSiteOwner?.structureType,
              friche_decontaminated_soil_surface_area:
                reconversionProject.decontaminatedSoilSurface,
              reinstatement_contract_owner_name:
                reconversionProject.reinstatementContractOwner?.name,
              reinstatement_contract_owner_structure_type:
                reconversionProject.reinstatementContractOwner?.structureType,
              site_purchase_selling_price: reconversionProject.sitePurchaseSellingPrice,
              site_purchase_property_transfer_duties:
                reconversionProject.sitePurchasePropertyTransferDuties,
              reinstatement_schedule_start_date:
                reconversionProject.reinstatementSchedule?.startDate,
              reinstatement_schedule_end_date: reconversionProject.reinstatementSchedule?.endDate,
              operations_first_year: reconversionProject.operationsFirstYear,
              project_phase: reconversionProject.projectPhase,
              site_resale_expected_selling_price: null,
              site_resale_expected_property_transfer_duties: null,
              buildings_resale_expected_selling_price: null,
              buildings_resale_expected_property_transfer_duties: null,
            },
          ]);
        });

        it("Saves right data in table reconversion_projects_soils_distributions", async () => {
          const siteId = await insertSiteInDb();
          const reconversionProject = buildReconversionProject({
            ...buildExhaustiveReconversionProjectProps(),
            createdAt: now,
            relatedSiteId: siteId,
            soilsDistribution: [
              { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", surfaceArea: 1200 },
              { soilType: "PRAIRIE_GRASS", surfaceArea: 5000 },
            ],
          });
          await reconversionProjectRepository.save(reconversionProject);

          const soilsDistributionResult = await sqlConnection(
            "reconversion_project_soils_distributions",
          ).select("surface_area", "soil_type", "reconversion_project_id");

          expect(soilsDistributionResult).toEqual([
            {
              soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surface_area: 1200.0,
              reconversion_project_id: reconversionProject.id,
            },
            {
              soil_type: "PRAIRIE_GRASS",
              surface_area: 5000.0,
              reconversion_project_id: reconversionProject.id,
            },
          ]);
        });

        it("Saves data in table reconversion_projects_soils_distributions with space_category", async () => {
          const siteId = await insertSiteInDb();
          const reconversionProject = buildReconversionProject({
            ...buildExhaustiveReconversionProjectProps(),
            createdAt: now,
            relatedSiteId: siteId,
            soilsDistribution: [
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                surfaceArea: 5000,
                spaceCategory: "PUBLIC_SPACE",
              },
              {
                soilType: "BUILDINGS",
                surfaceArea: 1200,
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
              },
            ],
          });
          await reconversionProjectRepository.save(reconversionProject);

          const soilsDistributionResult = await sqlConnection(
            "reconversion_project_soils_distributions",
          ).select("surface_area", "soil_type", "reconversion_project_id", "space_category");

          expect(soilsDistributionResult).toEqual([
            {
              soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surface_area: 5000.0,
              reconversion_project_id: reconversionProject.id,
              space_category: "PUBLIC_SPACE",
            },
            {
              soil_type: "BUILDINGS",
              surface_area: 1200.0,
              reconversion_project_id: reconversionProject.id,
              space_category: "LIVING_AND_ACTIVITY_SPACE",
            },
          ]);
        });
        it("Saves right data in table reconversion_projects_development_plans and reconversion_project_development_plan_costs", async () => {
          const siteId = await insertSiteInDb();
          const reconversionProject = buildReconversionProject({
            ...buildExhaustiveReconversionProjectProps(),
            relatedSiteId: siteId,
          });

          await reconversionProjectRepository.save(reconversionProject);

          const result = await sqlConnection("reconversion_project_development_plans as dp")
            .leftJoin(
              "reconversion_project_development_plan_costs as cost",
              "dp.id",
              "=",
              "cost.development_plan_id",
            )
            .select(
              "dp.type",
              "dp.features",
              "dp.developer_structure_type",
              "dp.developer_name",
              "dp.schedule_start_date",
              "dp.schedule_end_date",
              "dp.reconversion_project_id",
              sqlConnection.raw(`
              CASE 
                WHEN count(cost.id) = 0 THEN '[]'::json
                ELSE json_agg(json_build_object('amount', cost.amount, 'purpose', cost.purpose)) 
              END as "costs"
            `),
            )
            .groupBy("dp.id");
          expect(result).toEqual([
            {
              type: reconversionProject.developmentPlan.type,
              features: reconversionProject.developmentPlan.features,
              developer_name: reconversionProject.developmentPlan.developer.name,
              developer_structure_type: reconversionProject.developmentPlan.developer.structureType,
              reconversion_project_id: reconversionProject.id,
              schedule_start_date:
                reconversionProject.developmentPlan.installationSchedule?.startDate,
              schedule_end_date: reconversionProject.developmentPlan.installationSchedule?.endDate,
              costs: reconversionProject.developmentPlan.costs,
            },
          ]);
        });

        it("Saves right data in table reconversion_project_yearly_expenses", async () => {
          const siteId = await insertSiteInDb();
          const reconversionProject = buildReconversionProject({
            ...buildExhaustiveReconversionProjectProps(),
            relatedSiteId: siteId,
            soilsDistribution: [
              { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", surfaceArea: 1200 },
              { soilType: "PRAIRIE_GRASS", surfaceArea: 5000 },
            ],
          });

          await reconversionProjectRepository.save(reconversionProject);

          const yearlyExpensesResult = await sqlConnection(
            "reconversion_project_yearly_expenses",
          ).select("amount", "purpose", "reconversion_project_id");
          expect(yearlyExpensesResult).toEqual([
            {
              purpose: "rent",
              amount: 12000.0,
              reconversion_project_id: reconversionProject.id,
            },
          ]);
        });
        it("Saves right data in table reconversion_project_yearly_revenues", async () => {
          const siteId = await insertSiteInDb();
          const reconversionProject = buildReconversionProject({
            ...buildExhaustiveReconversionProjectProps(),
            relatedSiteId: siteId,
          });

          await reconversionProjectRepository.save(reconversionProject);

          const yearlyRevenuesResult = await sqlConnection(
            "reconversion_project_yearly_revenues",
          ).select("amount", "source", "reconversion_project_id");
          expect(yearlyRevenuesResult).toEqual([
            {
              source: "operations",
              amount: 13000.0,
              reconversion_project_id: reconversionProject.id,
            },
          ]);
        });
        it("Saves right data in table reconversion_project_reinstatement_costs", async () => {
          const siteId = await insertSiteInDb();
          const reinstatementCosts: ReconversionProjectSaveDto["reinstatementCosts"] = [
            { amount: 1000, purpose: "waste_collection" },
            { amount: 2000, purpose: "other_reinstatement_costs" },
          ] as const;
          const reconversionProject = buildReconversionProject({
            ...buildExhaustiveReconversionProjectProps(),
            relatedSiteId: siteId,
            reinstatementCosts,
          });

          await reconversionProjectRepository.save(reconversionProject);

          const reinstatementCostsResult = await sqlConnection(
            "reconversion_project_reinstatement_costs",
          ).select("amount", "purpose", "reconversion_project_id");
          expect(reinstatementCostsResult).toEqual(
            reinstatementCosts.map(({ amount, purpose }) => ({
              amount,
              purpose,
              reconversion_project_id: reconversionProject.id,
            })),
          );
        });

        it("Saves right data in table reconversion_project_financial_assistance_revenues", async () => {
          const siteId = await insertSiteInDb();
          const financialAssistanceRevenues: ReconversionProjectSaveDto["financialAssistanceRevenues"] =
            [
              { amount: 1000, source: "public_subsidies" },
              { amount: 2000, source: "other" },
            ] as const;
          const reconversionProject = buildReconversionProject({
            ...buildExhaustiveReconversionProjectProps(),
            relatedSiteId: siteId,
            financialAssistanceRevenues,
          });

          await reconversionProjectRepository.save(reconversionProject);

          const financialAssistanceRevenuesResult = await sqlConnection(
            "reconversion_project_financial_assistance_revenues",
          ).select("amount", "source", "reconversion_project_id");
          expect(financialAssistanceRevenuesResult).toEqual(
            financialAssistanceRevenues.map(({ amount, source }) => ({
              amount,
              source,
              reconversion_project_id: reconversionProject.id,
            })),
          );
        });
      });
    });
    describe("Urban project development plan", () => {
      let reconversionProject: ReconversionProjectSaveDto;

      beforeEach(async () => {
        const siteId = await insertSiteInDb();
        reconversionProject = {
          id: uuid(),
          createdBy: uuid(),
          creationMode: "express",
          name: "Projet urbain",
          developmentPlan: {
            type: "URBAN_PROJECT",
            developer: { name: "Montrouge", structureType: "municipality" },
            costs: [],
            installationSchedule: {
              startDate: new Date("2026-01-05T12:00:00.000Z"),
              endDate: new Date("2027-01-05T12:00:00.000Z"),
            },
            features: {
              buildingsFloorAreaDistribution: { RESIDENTIAL: 1840, LOCAL_STORE: 160 },
            },
          },
          futureSiteOwner: { name: "Montrouge", structureType: "municipality" },
          sitePurchaseSellingPrice: 3600000,
          sitePurchasePropertyTransferDuties: 209160,
          reinstatementCosts: undefined,
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
          soilsDistribution: [
            {
              soilType: "BUILDINGS",
              surfaceArea: 2000,
              spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
            },
            {
              soilType: "IMPERMEABLE_SOILS",
              surfaceArea: 500,
              spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
            },
            { soilType: "IMPERMEABLE_SOILS", surfaceArea: 900, spaceCategory: "PUBLIC_SPACE" },
            {
              soilType: "MINERAL_SOIL",
              surfaceArea: 200,
              spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
            },
            { soilType: "MINERAL_SOIL", surfaceArea: 700, spaceCategory: "PUBLIC_SPACE" },
            {
              soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surfaceArea: 1900,
              spaceCategory: "PUBLIC_SPACE",
            },
            {
              soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surfaceArea: 100,
              spaceCategory: "PUBLIC_GREEN_SPACE",
            },
            {
              soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surfaceArea: 3700,
              spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
            },
          ],

          reinstatementSchedule: {
            startDate: new Date("2025-01-05T12:00:00.000Z"),
            endDate: new Date("2026-01-05T12:00:00.000Z"),
          },
          operationsFirstYear: 2027,
          projectPhase: "planning",
          siteResaleExpectedSellingPrice: 2850000,
          siteResaleExpectedPropertyTransferDuties: 165585,
          buildingsResaleExpectedSellingPrice: 3999000,
          buildingsResaleExpectedPropertyTransferDuties: 233892,
          createdAt: now,
          relatedSiteId: siteId,
        };
      });

      it("Saves in table reconversion_projects", async () => {
        await reconversionProjectRepository.save(reconversionProject);

        const result = await sqlConnection("reconversion_projects").select("*");
        expect(result).toHaveLength(1);
        expect(result).toEqual([
          {
            id: reconversionProject.id,
            created_by: reconversionProject.createdBy,
            creation_mode: reconversionProject.creationMode,
            name: reconversionProject.name,
            related_site_id: reconversionProject.relatedSiteId,
            created_at: now,
            updated_at: null,
            description: null,
            future_operator_name: null,
            future_operator_structure_type: null,
            future_site_owner_name: reconversionProject.futureSiteOwner?.name,
            future_site_owner_structure_type: reconversionProject.futureSiteOwner?.structureType,
            friche_decontaminated_soil_surface_area: null,
            reinstatement_contract_owner_name: null,
            reinstatement_contract_owner_structure_type: null,
            site_purchase_selling_price: reconversionProject.sitePurchaseSellingPrice,
            site_purchase_property_transfer_duties:
              reconversionProject.sitePurchasePropertyTransferDuties,
            reinstatement_schedule_start_date: reconversionProject.reinstatementSchedule?.startDate,
            reinstatement_schedule_end_date: reconversionProject.reinstatementSchedule?.endDate,
            operations_first_year: reconversionProject.operationsFirstYear,
            project_phase: reconversionProject.projectPhase,
            site_resale_expected_selling_price: reconversionProject.siteResaleExpectedSellingPrice,
            site_resale_expected_property_transfer_duties:
              reconversionProject.siteResaleExpectedPropertyTransferDuties,
            buildings_resale_expected_selling_price:
              reconversionProject.buildingsResaleExpectedSellingPrice,
            buildings_resale_expected_property_transfer_duties:
              reconversionProject.buildingsResaleExpectedPropertyTransferDuties,
          },
        ]);
      });
      it("Saves in table reconversion_project_development_plans", async () => {
        await reconversionProjectRepository.save(reconversionProject);

        const result = await sqlConnection("reconversion_project_development_plans").select("*");
        expect(result).toHaveLength(1);
        expect(result).toEqual([
          {
            // oxlint-disable-next-line typescript/no-unsafe-assignment
            id: expect.any(String),
            type: reconversionProject.developmentPlan.type,
            features: reconversionProject.developmentPlan.features,
            developer_name: reconversionProject.developmentPlan.developer.name,
            developer_structure_type: reconversionProject.developmentPlan.developer.structureType,
            reconversion_project_id: reconversionProject.id,
            schedule_start_date:
              reconversionProject.developmentPlan.installationSchedule?.startDate,
            schedule_end_date: reconversionProject.developmentPlan.installationSchedule?.endDate,
          },
        ]);
      });
    });
  });

  describe("update", () => {
    describe("Photovoltaic power plant development plan", () => {
      it("Updates reconversion project main data", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          name: "Updated name",
          description: "Updated description",
          operationsFirstYear: 2030,
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const result = await sqlConnection("reconversion_projects")
          .select("*")
          .where({ id: reconversionProject.id })
          .first();

        expect(result).toMatchObject({
          id: reconversionProject.id,
          name: "Updated name",
          description: "Updated description",
          operations_first_year: 2030,
          updated_at: updatedAt,
        });
      });

      it("Updates future operator and site owner", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          futureOperator: { name: "New Operator", structureType: "company" },
          futureSiteOwner: { name: "New Owner", structureType: "local_or_regional_authority" },
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const result = await sqlConnection("reconversion_projects")
          .select("*")
          .where({ id: reconversionProject.id })
          .first();

        expect(result).toMatchObject({
          future_operator_name: "New Operator",
          future_operator_structure_type: "company",
          future_site_owner_name: "New Owner",
          future_site_owner_structure_type: "local_or_regional_authority",
        });
      });

      it("Updates soils distribution by deleting old and inserting new", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .withSoilsDistribution([
            { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", surfaceArea: 1200 },
            { soilType: "PRAIRIE_GRASS", surfaceArea: 5000 },
          ])
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          soilsDistribution: [
            { soilType: "BUILDINGS", surfaceArea: 3000 },
            { soilType: "MINERAL_SOIL", surfaceArea: 2000 },
            { soilType: "PRAIRIE_GRASS", surfaceArea: 1200 },
          ],
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const soilsDistributionResult = await sqlConnection(
          "reconversion_project_soils_distributions",
        )
          .select("surface_area", "soil_type", "reconversion_project_id")
          .where({ reconversion_project_id: reconversionProject.id })
          .orderBy("soil_type");

        expect(soilsDistributionResult).toEqual([
          {
            soil_type: "BUILDINGS",
            surface_area: 3000.0,
            reconversion_project_id: reconversionProject.id,
          },
          {
            soil_type: "MINERAL_SOIL",
            surface_area: 2000.0,
            reconversion_project_id: reconversionProject.id,
          },
          {
            soil_type: "PRAIRIE_GRASS",
            surface_area: 1200.0,
            reconversion_project_id: reconversionProject.id,
          },
        ]);
      });

      it("Updates soils distribution with space_category", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .withSoilsDistribution([
            { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", surfaceArea: 5000 },
          ])
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          soilsDistribution: [
            {
              soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surfaceArea: 4000,
              spaceCategory: "PUBLIC_SPACE",
            },
            {
              soilType: "BUILDINGS",
              surfaceArea: 1200,
              spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
            },
          ],
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const soilsDistributionResult = await sqlConnection(
          "reconversion_project_soils_distributions",
        )
          .select("surface_area", "soil_type", "space_category", "reconversion_project_id")
          .where({ reconversion_project_id: reconversionProject.id })
          .orderBy("soil_type");

        expect(soilsDistributionResult).toEqual([
          {
            soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            surface_area: 4000.0,
            space_category: "PUBLIC_SPACE",
            reconversion_project_id: reconversionProject.id,
          },
          {
            soil_type: "BUILDINGS",
            surface_area: 1200.0,
            space_category: "LIVING_AND_ACTIVITY_SPACE",
            reconversion_project_id: reconversionProject.id,
          },
        ]);
      });

      it("Updates development plan data", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          developmentPlan: {
            ...reconversionProject.developmentPlan,
            type: "URBAN_PROJECT",
            developer: { name: "New Developer", structureType: "company" },
            features: {
              buildingsFloorAreaDistribution: {
                SPORTS_FACILITIES: 1500,
              },
            },
            installationSchedule: {
              startDate: new Date("2027-01-01"),
              endDate: new Date("2028-01-01"),
            },
          },
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const result = await sqlConnection("reconversion_project_development_plans")
          .select("*")
          .where({ reconversion_project_id: reconversionProject.id })
          .first();

        expect(result).toMatchObject({
          developer_name: "New Developer",
          developer_structure_type: "company",
          schedule_start_date: new Date("2027-01-01"),
          schedule_end_date: new Date("2028-01-01"),
        });
        expect(result?.features).toEqual({
          buildingsFloorAreaDistribution: {
            SPORTS_FACILITIES: 1500,
          },
        });
      });

      it("Updates development plan costs", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .build();
        reconversionProject.developmentPlan.costs = [
          { amount: 1000, purpose: "cost1" },
          { amount: 2000, purpose: "cost2" },
        ];
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          developmentPlan: {
            ...reconversionProject.developmentPlan,
            costs: [
              { amount: 3000, purpose: "new_cost1" },
              { amount: 4000, purpose: "new_cost2" },
              { amount: 5000, purpose: "new_cost3" },
            ],
          },
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const developmentPlan = await sqlConnection("reconversion_project_development_plans")
          .select("id")
          .where({ reconversion_project_id: reconversionProject.id })
          .first();

        const costsResult = await sqlConnection("reconversion_project_development_plan_costs")
          .select("amount", "purpose")
          .where({ development_plan_id: developmentPlan?.id })
          .orderBy("amount");

        expect(costsResult).toEqual([
          { amount: 3000, purpose: "new_cost1" },
          { amount: 4000, purpose: "new_cost2" },
          { amount: 5000, purpose: "new_cost3" },
        ]);
      });

      it("Updates yearly expenses", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .withYearlyExpenses([
            { amount: 1000, purpose: "other" },
            { amount: 2000, purpose: "maintenance" },
          ])
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          yearlyProjectedCosts: [
            { amount: 2000, purpose: "maintenance" },
            { amount: 3000, purpose: "other" },
          ],
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const expensesResult = await sqlConnection("reconversion_project_yearly_expenses")
          .select("amount", "purpose")
          .where({ reconversion_project_id: reconversionProject.id })
          .orderBy("amount");

        expect(expensesResult).toEqual([
          { amount: 2000, purpose: "maintenance" },
          { amount: 3000, purpose: "other" },
        ]);
      });

      it("Updates yearly revenues", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .withYearlyRevenues([{ amount: 10000, source: "operations" }])
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          yearlyProjectedRevenues: [
            { amount: 15000, source: "operations" },
            { amount: 20000, source: "rent" },
          ],
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const revenuesResult = await sqlConnection("reconversion_project_yearly_revenues")
          .select("amount", "source")
          .where({ reconversion_project_id: reconversionProject.id })
          .orderBy("amount");

        expect(revenuesResult).toEqual([
          { amount: 15000, source: "operations" },
          { amount: 20000, source: "rent" },
        ]);
      });

      it("Updates reinstatement costs", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .withReinstatement({
            costs: [{ amount: 5000, purpose: "waste_collection" }],
            contractOwner: { structureType: "company", name: "test" },
            schedule: { startDate: new Date("2025-02-25"), endDate: new Date("2025-12-18") },
          })
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          reinstatementCosts: [
            { amount: 6000, purpose: "waste_collection" },
            { amount: 7000, purpose: "asbestos_removal" },
          ],
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const costsResult = await sqlConnection("reconversion_project_reinstatement_costs")
          .select("amount", "purpose")
          .where({ reconversion_project_id: reconversionProject.id })
          .orderBy("amount");

        expect(costsResult).toEqual([
          { amount: 6000, purpose: "waste_collection" },
          { amount: 7000, purpose: "asbestos_removal" },
        ]);
      });

      it("Handles empty reinstatement costs by deleting all", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .withReinstatement({
            costs: [{ amount: 5000, purpose: "waste_collection" }],
            contractOwner: { structureType: "company", name: "test" },
            schedule: { startDate: new Date("2025-02-25"), endDate: new Date("2025-12-18") },
          })
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          reinstatementCosts: [],
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const costsResult = await sqlConnection("reconversion_project_reinstatement_costs")
          .select("*")
          .where({ reconversion_project_id: reconversionProject.id });

        expect(costsResult).toEqual([]);
      });

      it("Updates financial assistance revenues", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .build();
        reconversionProject.financialAssistanceRevenues = [{ amount: 8000, source: "old_subsidy" }];
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          financialAssistanceRevenues: [
            { amount: 9000, source: "public_subsidies" },
            { amount: 10000, source: "other" },
          ],
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const revenuesResult = await sqlConnection(
          "reconversion_project_financial_assistance_revenues",
        )
          .select("amount", "source")
          .where({ reconversion_project_id: reconversionProject.id })
          .orderBy("amount");

        expect(revenuesResult).toEqual([
          { amount: 9000, source: "public_subsidies" },
          { amount: 10000, source: "other" },
        ]);
      });

      it("Updates all financial data at once", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          sitePurchaseSellingPrice: 500000,
          sitePurchasePropertyTransferDuties: 30000,
          siteResaleExpectedSellingPrice: 600000,
          siteResaleExpectedPropertyTransferDuties: 35000,
          buildingsResaleExpectedSellingPrice: 700000,
          buildingsResaleExpectedPropertyTransferDuties: 40000,
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const result = await sqlConnection("reconversion_projects")
          .select("*")
          .where({ id: reconversionProject.id })
          .first();

        expect(result).toMatchObject({
          site_purchase_selling_price: 500000,
          site_purchase_property_transfer_duties: 30000,
          site_resale_expected_selling_price: 600000,
          site_resale_expected_property_transfer_duties: 35000,
          buildings_resale_expected_selling_price: 700000,
          buildings_resale_expected_property_transfer_duties: 40000,
        });
      });

      it("Updates reinstatement schedule", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = new UrbanProjectBuilder()
          .withCreatedBy("9b3a4906-1db2-441d-97d5-7be287add907")
          .withRelatedSiteId(siteId)
          .build();
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          reinstatementSchedule: {
            startDate: new Date("2026-06-01"),
            endDate: new Date("2027-06-01"),
          },
          reinstatementContractOwner: {
            name: "New Contractor",
            structureType: "company",
          },
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const result = await sqlConnection("reconversion_projects")
          .select("*")
          .where({ id: reconversionProject.id })
          .first();

        expect(result).toMatchObject({
          reinstatement_schedule_start_date: new Date("2026-06-01"),
          reinstatement_schedule_end_date: new Date("2027-06-01"),
          reinstatement_contract_owner_name: "New Contractor",
          reinstatement_contract_owner_structure_type: "company",
        });
      });
    });

    describe("Urban project development plan", () => {
      it("Updates urban project specific data", async () => {
        const siteId = await insertSiteInDb();
        const reconversionProject = {
          id: uuid(),
          createdBy: uuid(),
          creationMode: "express" as const,
          name: "Projet urbain",
          developmentPlan: {
            type: "URBAN_PROJECT" as const,
            developer: { name: "Montrouge", structureType: "municipality" },
            costs: [],
            installationSchedule: {
              startDate: new Date("2026-01-05"),
              endDate: new Date("2027-01-05"),
            },
            features: {
              buildingsFloorAreaDistribution: { RESIDENTIAL: 1840 },
            },
          },
          soilsDistribution: [{ soilType: "BUILDINGS" as const, surfaceArea: 10000 }],
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
          projectPhase: "planning",
          createdAt: now,
          relatedSiteId: siteId,
        };
        await reconversionProjectRepository.save(reconversionProject);

        const updatedProject: ReconversionProjectUpdateDto = {
          ...reconversionProject,
          name: "Updated urban project",
          soilsDistribution: [
            { soilType: "BUILDINGS", surfaceArea: 3000 },
            {
              soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              spaceCategory: "PUBLIC_GREEN_SPACE",
              surfaceArea: 1500,
            },
          ],

          developmentPlan: {
            ...reconversionProject.developmentPlan,
            developer: { name: "Paris", structureType: "municipality" },
            features: {
              buildingsFloorAreaDistribution: { RESIDENTIAL: 2500, LOCAL_STORE: 500 },
            },
          },
          updatedAt,
        };

        await reconversionProjectRepository.update(updatedProject);

        const result = await reconversionProjectRepository.getById(reconversionProject.id);

        const developmentPlanFeatures = result?.developmentPlan.features as UrbanProjectFeatures;

        expect(result?.developmentPlan.developer.name).toEqual("Paris");
        expect(result?.developmentPlan.type).toEqual("URBAN_PROJECT");
        expect(result?.name).toEqual("Updated urban project");
        expect(result?.relatedSiteId).toEqual(siteId);
        expect(result?.projectPhase).toEqual("planning");
        expect(
          result?.soilsDistribution.find((elem) => elem.soilType === "BUILDINGS")?.surfaceArea,
        ).toBe(3000);
        expect(
          result?.soilsDistribution.find((elem) => elem.spaceCategory === "PUBLIC_GREEN_SPACE")
            ?.surfaceArea,
        ).toBe(1500);
        expect(developmentPlanFeatures.buildingsFloorAreaDistribution.RESIDENTIAL).toBe(2500);
        expect(developmentPlanFeatures.buildingsFloorAreaDistribution.LOCAL_STORE).toBe(500);
      });
    });
  });
});
