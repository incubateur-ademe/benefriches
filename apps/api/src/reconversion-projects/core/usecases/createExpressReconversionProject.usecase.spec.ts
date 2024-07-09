import { v4 as uuid } from "uuid";
import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/reconversion-project-repository/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemorySiteReadRepository } from "src/sites/adapters/secondary/site-repository/read/InMemorySiteReadRepository";
import { SoilsDistribution } from "src/soils/domain/soils";
import { MixedUseNeighbourhoodFeatures, SpacesDistribution } from "../model/mixedUseNeighbourhood";
import { ReconversionProject } from "../model/reconversionProject";
import {
  CreateExpressReconversionProjectUseCase,
  DateProvider,
} from "./createExpressReconversionProject.usecase";

describe("CreateReconversionProject Use Case", () => {
  let dateProvider: DateProvider;
  let siteRepository: InMemorySiteReadRepository;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    siteRepository = new InMemorySiteReadRepository();
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
  });

  describe("Error cases", () => {
    it("cannot create an express reconversion project with a non-existing site", async () => {
      const usecase = new CreateExpressReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
      );

      const siteId = uuid();
      await expect(
        usecase.execute({ reconversionProjectId: uuid(), siteId, createdBy: uuid() }),
      ).rejects.toThrow(`Site with id ${siteId} does not exist`);
    });
  });

  describe("Success cases", () => {
    describe("Mixed-use neighbourhood", () => {
      describe("On friche site", () => {
        const site = {
          id: uuid(),
          name: "Base site",
          isFriche: true,
          surfaceArea: 10000,
          soilsDistribution: {
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
            IMPERMEABLE_SOILS: 3000,
            MINERAL_SOIL: 2000,
          },
          contaminatedSoilSurface: 0,
          owner: {
            name: "Mairie de Montrouge",
            structureType: "local_authority",
          },
          address: {
            city: "Montrouge",
            postalCode: "12345",
            street: "Avenue Pierre Brossolette",
            streetNumber: "155bis",
            value: "155 bis Av. Pierre Brossolette, 92120 Montrouge",
            banId: "92049_7161_00155_bis",
            cityCode: "92049",
            postCode: "92120",
            long: 2.305116,
            lat: 48.815679,
          },
          yearlyExpenses: [],
        };

        beforeEach(() => {
          siteRepository._setSites([site]);
        });

        it("should create a mixed-use neighbourhood project with default name, given related site id, createdBy and createdAt", async () => {
          const usecase = new CreateExpressReconversionProjectUseCase(
            dateProvider,
            siteRepository,
            reconversionProjectRepository,
          );

          const reconversionProjectId = uuid();
          const creatorId = uuid();
          await usecase.execute({ reconversionProjectId, siteId: site.id, createdBy: creatorId });

          const createdReconversionProjects: ReconversionProject[] =
            reconversionProjectRepository._getReconversionProjects();
          expect(createdReconversionProjects).toHaveLength(1);
          const createdReconversionProject = createdReconversionProjects[0];
          expect(createdReconversionProject?.name).toEqual("Quartier mixte");
          expect(createdReconversionProject?.relatedSiteId).toEqual(site.id);
          expect(createdReconversionProject?.createdBy).toEqual(creatorId);
          expect(createdReconversionProject?.createdAt).toEqual(dateProvider.now());
        });

        it("should create a mixed-use neighbourhood project with reinstatement scheduled 1 year after current date, installation works 1 year after reinstatement and first operations 1 year after", async () => {
          dateProvider = new DeterministicDateProvider(new Date("2024-09-01T13:00:00"));

          const usecase = new CreateExpressReconversionProjectUseCase(
            dateProvider,
            siteRepository,
            reconversionProjectRepository,
          );

          const reconversionProjectId = uuid();
          const creatorId = uuid();
          await usecase.execute({ reconversionProjectId, siteId: site.id, createdBy: creatorId });

          const createdReconversionProjects: ReconversionProject[] =
            reconversionProjectRepository._getReconversionProjects();
          expect(createdReconversionProjects).toHaveLength(1);
          const createdReconversionProject = createdReconversionProjects[0];
          expect(createdReconversionProject?.reinstatementSchedule).toEqual({
            startDate: new Date("2025-09-01T13:00:00"),
            endDate: new Date("2026-09-01T13:00:00"),
          });
          expect(createdReconversionProject?.developmentPlan.installationSchedule).toEqual({
            startDate: new Date("2026-09-01T13:00:00"),
            endDate: new Date("2027-09-01T13:00:00"),
          });
          expect(createdReconversionProject?.operationsFirstYear).toEqual(2027);
        });

        it("should create a mixed-use neighbourhood project with site city as developer, reinstatement contract owner and site owner", async () => {
          const usecase = new CreateExpressReconversionProjectUseCase(
            dateProvider,
            siteRepository,
            reconversionProjectRepository,
          );

          const reconversionProjectId = uuid();
          const creatorId = uuid();
          await usecase.execute({ reconversionProjectId, siteId: site.id, createdBy: creatorId });

          const createdReconversionProjects: ReconversionProject[] =
            reconversionProjectRepository._getReconversionProjects();
          expect(createdReconversionProjects).toHaveLength(1);
          const createdReconversionProject = createdReconversionProjects[0];
          expect(createdReconversionProject?.futureSiteOwner).toEqual({
            structureType: "local_or_regional_authority",
            name: "Montrouge",
          });
          expect(createdReconversionProject?.developmentPlan.developer).toEqual({
            structureType: "local_or_regional_authority",
            name: "Montrouge",
          });
          expect(createdReconversionProject?.reinstatementContractOwner).toEqual({
            structureType: "local_or_regional_authority",
            name: "Montrouge",
          });
        });

        it("should create a mixed-use neighbourhood project with right spaces, buildings floor area and soils distribution", async () => {
          const usecase = new CreateExpressReconversionProjectUseCase(
            dateProvider,
            siteRepository,
            reconversionProjectRepository,
          );

          const reconversionProjectId = uuid();
          const creatorId = uuid();
          await usecase.execute({ reconversionProjectId, siteId: site.id, createdBy: creatorId });

          const expectedSpacesDistribution = {
            BUILDINGS_FOOTPRINT: 0.2 * site.surfaceArea,
            PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 0.05 * site.surfaceArea,
            PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 0.02 * site.surfaceArea,
            PRIVATE_GARDEN_AND_GRASS_ALLEYS: 0.37 * site.surfaceArea,
            PUBLIC_GREEN_SPACES: 0.19 * site.surfaceArea,
            PUBLIC_PARKING_LOT: 0.05 * site.surfaceArea,
            PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.04 * site.surfaceArea,
            PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.07 * site.surfaceArea,
            PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.01 * site.surfaceArea,
          } as const satisfies SpacesDistribution;

          const expectedBuildingsFloorAreaDistribution = {
            RESIDENTIAL: 0.92 * 0.2 * site.surfaceArea,
            GROUND_FLOOR_RETAIL: 0.08 * 0.2 * site.surfaceArea,
          };

          const expectedSoilsDistribution: SoilsDistribution = {
            BUILDINGS: expectedSpacesDistribution.BUILDINGS_FOOTPRINT,
            ARTIFICIAL_TREE_FILLED: expectedSpacesDistribution.PUBLIC_GREEN_SPACES,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
              expectedSpacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS +
              expectedSpacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS,
            IMPERMEABLE_SOILS:
              expectedSpacesDistribution.PUBLIC_PARKING_LOT +
              expectedSpacesDistribution.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT +
              expectedSpacesDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS,
            MINERAL_SOIL:
              expectedSpacesDistribution.PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT +
              expectedSpacesDistribution.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS,
          };

          const createdReconversionProjects: ReconversionProject[] =
            reconversionProjectRepository._getReconversionProjects();
          expect(createdReconversionProjects).toHaveLength(1);
          const createdReconversionProject = createdReconversionProjects[0];
          expect(createdReconversionProject?.developmentPlan.type).toEqual(
            "MIXED_USE_NEIGHBOURHOOD",
          );
          expect(
            (createdReconversionProject?.developmentPlan.features as MixedUseNeighbourhoodFeatures)
              .spacesDistribution,
          ).toEqual(expectedSpacesDistribution);
          expect(
            (createdReconversionProject?.developmentPlan.features as MixedUseNeighbourhoodFeatures)
              .buildingsFloorAreaDistribution,
          ).toEqual(expectedBuildingsFloorAreaDistribution);
          expect(createdReconversionProject?.soilsDistribution).toEqual(expectedSoilsDistribution);
        });

        it("should create a mixed-use neighbourhood project with expected sale after development relative to buildings floor surface area", async () => {
          const usecase = new CreateExpressReconversionProjectUseCase(
            dateProvider,
            siteRepository,
            reconversionProjectRepository,
          );

          const reconversionProjectId = uuid();
          const creatorId = uuid();
          await usecase.execute({ reconversionProjectId, siteId: site.id, createdBy: creatorId });

          const createdReconversionProjects: ReconversionProject[] =
            reconversionProjectRepository._getReconversionProjects();
          expect(createdReconversionProjects).toHaveLength(1);
          const createdReconversionProject = createdReconversionProjects[0];
          const buildingsFloorSurfaceArea = 0.38 * site.surfaceArea;
          expect(createdReconversionProject?.siteResaleExpectedSellingPrice).toEqual(
            buildingsFloorSurfaceArea * 150,
          );
          expect(createdReconversionProject?.siteResaleExpectedPropertyTransferDuties).toEqual(
            buildingsFloorSurfaceArea * 150 * 0.0581,
          );
        });

        describe("with non-polluted soils and no buildings", () => {
          const nonPollutedFricheWithNoBuildings = {
            ...site,
            contaminatedSoilSurface: 0,
          };
          it("should create a mixed-use neighbourhood with reinstatement costs, real estate sale transaction and development installation costs", async () => {
            siteRepository._setSites([nonPollutedFricheWithNoBuildings]);

            const usecase = new CreateExpressReconversionProjectUseCase(
              dateProvider,
              siteRepository,
              reconversionProjectRepository,
            );

            const reconversionProjectId = uuid();
            const creatorId = uuid();
            await usecase.execute({
              reconversionProjectId,
              siteId: nonPollutedFricheWithNoBuildings.id,
              createdBy: creatorId,
            });

            const createdReconversionProjects: ReconversionProject[] =
              reconversionProjectRepository._getReconversionProjects();
            expect(createdReconversionProjects).toHaveLength(1);
            const createdReconversionProject = createdReconversionProjects[0];
            // real estate sale transaction
            expect(createdReconversionProject?.sitePurchaseSellingPrice).toEqual(720000);
            expect(createdReconversionProject?.sitePurchasePropertyTransferDuties).toEqual(41832);
            // development installation cost
            expect(createdReconversionProject?.developmentPlan.costs).toEqual([
              { purpose: "technical_studies", amount: 60000 },
              { purpose: "development_works", amount: 540000 },
              { purpose: "other", amount: 54000 },
            ]);
            // reinstatement costs
            expect(createdReconversionProject?.reinstatementCosts).toEqual([]);
          });
        });
        describe("with polluted soils and buildings", () => {
          const pollutedFricheWithBuildings = {
            ...site,
            surfaceArea: 100000,
            name: "Base site with polluted soils and buildings",
            soilsDistribution: {
              BUILDINGS: 1000,
              IMPERMEABLE_SOILS: 30000,
              MINERAL_SOIL: 69000,
            },
            contaminatedSoilSurface: 50000,
          };
          it("should create a mixed-use neighbourhood with reinstatement costs, real estate sale transaction and development installation costs based on site data", async () => {
            siteRepository._setSites([pollutedFricheWithBuildings]);

            const usecase = new CreateExpressReconversionProjectUseCase(
              dateProvider,
              siteRepository,
              reconversionProjectRepository,
            );

            const reconversionProjectId = uuid();
            const creatorId = uuid();
            await usecase.execute({
              reconversionProjectId,
              siteId: pollutedFricheWithBuildings.id,
              createdBy: creatorId,
            });

            const createdReconversionProjects: ReconversionProject[] =
              reconversionProjectRepository._getReconversionProjects();
            expect(createdReconversionProjects).toHaveLength(1);
            const createdReconversionProject = createdReconversionProjects[0];
            // real estate sale transaction
            expect(createdReconversionProject?.sitePurchaseSellingPrice).toEqual(7200000);
            expect(createdReconversionProject?.sitePurchasePropertyTransferDuties).toEqual(418320);
            // development installation cost
            expect(createdReconversionProject?.developmentPlan.costs).toEqual([
              { purpose: "technical_studies", amount: 600000 },
              { purpose: "development_works", amount: 5400000 },
              { purpose: "other", amount: 540000 },
            ]);
            // reinstatement costs
            expect(createdReconversionProject?.reinstatementCosts).toHaveLength(3);
            expect(createdReconversionProject?.reinstatementCosts).toContainEqual({
              purpose: "asbestos_removal",
              amount: 75000,
            });
            expect(createdReconversionProject?.reinstatementCosts).toContainEqual({
              purpose: "demolition",
              amount: 75000,
            });
            expect(createdReconversionProject?.reinstatementCosts).toContainEqual({
              purpose: "remediation",
              amount: 2475000,
            });
          });
        });
        describe("with less impermeable soils once developed", () => {
          const allImpermeableFriche = {
            ...site,
            soilsDistribution: {
              BUILDINGS: 7000,
              IMPERMEABLE_SOILS: 3000,
            },
          };

          it("should create mixed-use neighbourhood with deimpermeabilization and sustainable soils reinstatement expenses", async () => {
            siteRepository._setSites([allImpermeableFriche]);

            const usecase = new CreateExpressReconversionProjectUseCase(
              dateProvider,
              siteRepository,
              reconversionProjectRepository,
            );

            const reconversionProjectId = uuid();
            const creatorId = uuid();
            await usecase.execute({
              reconversionProjectId,
              siteId: allImpermeableFriche.id,
              createdBy: creatorId,
            });

            const createdReconversionProjects: ReconversionProject[] =
              reconversionProjectRepository._getReconversionProjects();
            expect(createdReconversionProjects).toHaveLength(1);
            const createdReconversionProject = createdReconversionProjects[0];
            // reinstatement costs
            expect(createdReconversionProject?.reinstatementCosts).toHaveLength(4);
            expect(createdReconversionProject?.reinstatementCosts?.at(0)).toEqual({
              purpose: "deimpermeabilization",
              amount: 66000,
            });
            expect(createdReconversionProject?.reinstatementCosts?.at(1)).toEqual({
              purpose: "sustainable_soils_reinstatement",
              amount: 256500,
            });
            expect(createdReconversionProject?.reinstatementCosts?.at(2)?.purpose).toEqual(
              "demolition",
            );
            expect(createdReconversionProject?.reinstatementCosts?.at(3)?.purpose).toEqual(
              "asbestos_removal",
            );
          });
        });
      });
      describe("On non-friche site", () => {
        describe("with polluted soils and buildings", () => {
          const site = {
            id: uuid(),
            name: "Base site",
            isFriche: false,
            surfaceArea: 50000,
            soilsDistribution: {
              PRAIRIE_GRASS: 30000,
              FOREST_MIXED: 18900,
              WATER: 600,
              MINERAL_SOIL: 500,
            },
            contaminatedSoilSurface: 0,
            owner: {
              name: "Monsieur Dupont",
              structureType: "private_individual",
            },
            address: {
              city: "Montrouge",
              postalCode: "12345",
              street: "Avenue Pierre Brossolette",
              streetNumber: "155bis",
              value: "155 bis Av. Pierre Brossolette, 92120 Montrouge",
              banId: "92049_7161_00155_bis",
              cityCode: "92049",
              postCode: "92120",
              long: 2.305116,
              lat: 48.815679,
            },
            yearlyExpenses: [],
          };
          it("should create a mixed-use neighbourhood with real estate sale transaction and development installation costs based on site", async () => {
            siteRepository._setSites([site]);

            const usecase = new CreateExpressReconversionProjectUseCase(
              dateProvider,
              siteRepository,
              reconversionProjectRepository,
            );

            const reconversionProjectId = uuid();
            const creatorId = uuid();
            await usecase.execute({
              reconversionProjectId,
              siteId: site.id,
              createdBy: creatorId,
            });

            const createdReconversionProjects: ReconversionProject[] =
              reconversionProjectRepository._getReconversionProjects();
            expect(createdReconversionProjects).toHaveLength(1);
            const createdReconversionProject = createdReconversionProjects[0];
            // real estate sale transaction
            expect(createdReconversionProject?.sitePurchaseSellingPrice).toEqual(3600000);
            expect(createdReconversionProject?.sitePurchasePropertyTransferDuties).toEqual(209160);
            // development installation cost
            expect(createdReconversionProject?.developmentPlan.costs).toEqual([
              { purpose: "technical_studies", amount: 300000 },
              { purpose: "development_works", amount: 2700000 },
              { purpose: "other", amount: 270000 },
            ]);
            // reinstatement costs
            expect(createdReconversionProject?.reinstatementCosts).toEqual(undefined);
          });
        });
      });
    });
  });
});
