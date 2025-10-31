import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { FailureResult } from "src/shared-kernel/result";

import { ReconversionProjectUpdatePropsDto } from "../model/reconversionProject";
import {
  buildMinimalReconversionProjectProps,
  UrbanProjectBuilder,
} from "../model/reconversionProject.mock";
import { UpdateReconversionProjectUseCase } from "./updateReconversionProject.usecase";

const baseUpdateReconversionProjectProps = {
  name: "Centrale photovoltaique",
  developmentPlan: {
    type: "PHOTOVOLTAIC_POWER_PLANT",
    costs: [{ amount: 130000, purpose: "installation_works" }],
    developer: {
      structureType: "company",
      name: "Terre cuite d’occitanie",
    },
    features: {
      surfaceArea: 1200,
      contractDuration: 25,
      electricalPowerKWc: 10000,
      expectedAnnualProduction: 12000,
    },
  },

  soilsDistribution: [
    {
      soilType: "BUILDINGS",
      surfaceArea: 3000,
    },
    {
      soilType: "ARTIFICIAL_TREE_FILLED",
      surfaceArea: 5000,
    },
    {
      soilType: "FOREST_MIXED",
      surfaceArea: 60000,
    },
    {
      soilType: "MINERAL_SOIL",
      surfaceArea: 5000,
    },
    {
      soilType: "IMPERMEABLE_SOILS",
      surfaceArea: 1300,
    },
  ],
  yearlyProjectedCosts: [{ purpose: "rent", amount: 12000 }],
  yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }],
  projectPhase: "planning",
} as const satisfies ReconversionProjectUpdatePropsDto;

describe("UpdateReconversionProject Use Case", () => {
  let dateProvider: DateProvider;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
  });

  describe("Error cases", () => {
    describe("Mandatory input data", () => {
      it.each([
        "name",
        "developmentPlan",
        "soilsDistribution",
        "yearlyProjectedCosts",
        "yearlyProjectedRevenues",
        "projectPhase",
      ])("Cannot update a reconversion project without providing %s", async (mandatoryField) => {
        const reconversionProject = new UrbanProjectBuilder().build();
        reconversionProjectRepository._setReconversionProjects([reconversionProject]);

        const reconversionProjectProps = { ...baseUpdateReconversionProjectProps }; // @ts-expect-error dynamic delete
        // oxlint-disable-next-line typescript/no-dynamic-delete
        delete reconversionProjectProps[mandatoryField];

        const usecase = new UpdateReconversionProjectUseCase(
          dateProvider,
          reconversionProjectRepository,
        );

        const result = await usecase.execute({
          reconversionProjectId: reconversionProject.id,
          reconversionProjectProps,
          userId: reconversionProject.createdBy,
        });
        expect(result.isFailure()).toBe(true);
        const failureResult = result as FailureResult<
          "ValidationError",
          { fieldErrors: Record<string, string[]> }
        >;
        expect(failureResult.getError()).toBe("ValidationError");
        const issues = failureResult.getIssues();
        expect(issues).toBeDefined();
        expect(issues?.fieldErrors).toBeDefined();
      });
    });

    it("Cannot update a non-existing reconversion project", async () => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      const usecase = new UpdateReconversionProjectUseCase(
        dateProvider,
        reconversionProjectRepository,
      );
      const result = await usecase.execute({
        reconversionProjectId: "wrong id",
        reconversionProjectProps,
        userId: reconversionProjectProps.createdBy,
      });
      expect(result.isFailure()).toBe(true);
      const failureResult = result as FailureResult<"ReconversionProjectNotFound">;
      expect(failureResult.getError()).toBe("ReconversionProjectNotFound");
    });

    it("Cannot update a reconversion project not created by user", async () => {
      const reconversionProject = new UrbanProjectBuilder().build();
      reconversionProjectRepository._setReconversionProjects([reconversionProject]);

      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      const usecase = new UpdateReconversionProjectUseCase(
        dateProvider,
        reconversionProjectRepository,
      );
      const result = await usecase.execute({
        reconversionProjectId: reconversionProject.id,
        reconversionProjectProps,
        userId: "wrong user",
      });
      expect(result.isFailure()).toBe(true);
      const failureResult = result as FailureResult<"UserNotAuthorized">;
      expect(failureResult.getError()).toBe("UserNotAuthorized");
    });
  });

  describe("Success cases", () => {
    describe("Urban project", () => {
      it("can update an urban reconversion project", async () => {
        const reconversionProject = new UrbanProjectBuilder().build();
        reconversionProjectRepository._setReconversionProjects([reconversionProject]);

        const usecase = new UpdateReconversionProjectUseCase(
          dateProvider,
          reconversionProjectRepository,
        );

        const {
          id: _,
          relatedSiteId: __,
          createdAt: ___,
          createdBy: ____,
          ...props
        } = reconversionProject;
        const result = await usecase.execute({
          reconversionProjectId: reconversionProject.id,
          reconversionProjectProps: {
            ...props,
            name: "UpdatedName",
            projectPhase: "setup",
          },
          userId: reconversionProject.createdBy,
        });

        expect(result.isSuccess()).toBe(true);
        const updatedReconversionProject = await reconversionProjectRepository.getById(
          reconversionProject.id,
        );

        expect(updatedReconversionProject).toEqual({
          ...reconversionProject,
          updatedAt: fakeNow,
          name: "UpdatedName",
          projectPhase: "setup",
        });
      });
    });
  });
});
