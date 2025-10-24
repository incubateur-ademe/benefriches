import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { FailureResult } from "src/shared-kernel/result";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";
import { buildFriche } from "src/sites/core/models/site.mock";
import { SiteEntity } from "src/sites/core/models/siteEntity";

import {
  buildExhaustiveReconversionProjectProps,
  buildMinimalReconversionProjectProps,
  buildReconversionProject,
  buildUrbanProjectReconversionProjectProps,
} from "../model/reconversionProject.mock";
import { CreateReconversionProjectUseCase } from "./createReconversionProject.usecase";

describe("CreateReconversionProject Use Case", () => {
  let dateProvider: DateProvider;
  let siteRepository: InMemorySitesRepository;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    siteRepository = new InMemorySitesRepository();
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
  });

  describe("Error cases", () => {
    describe("Mandatory input data", () => {
      it.each([
        "id",
        "name",
        "createdBy",
        "relatedSiteId",
        "developmentPlan",
        "soilsDistribution",
        "yearlyProjectedCosts",
        "yearlyProjectedRevenues",
        "projectPhase",
      ])("Cannot create a reconversion project without providing %s", async (mandatoryField) => {
        const reconversionProjectProps = buildMinimalReconversionProjectProps(); // @ts-expect-error dynamic delete
        // oxlint-disable-next-line typescript/no-dynamic-delete
        delete reconversionProjectProps[mandatoryField];

        const usecase = new CreateReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
        );

        const result = await usecase.execute({ reconversionProjectProps });
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

    it("Cannot create a reconversion project on a non-existing site", async () => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
      );
      const result = await usecase.execute({ reconversionProjectProps });
      expect(result.isFailure()).toBe(true);
      const failureResult = result as FailureResult<"ValidationError">;
      expect(failureResult.getError()).toBe("SiteNotFound");
    });

    it("Cannot create a reconversion project with existing id", async () => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      const siteEntity: SiteEntity = {
        ...buildFriche({ id: reconversionProjectProps.relatedSiteId }),
        createdAt: fakeNow,
        createdBy: "user-123",
        creationMode: "custom",
      };
      siteRepository._setSites([siteEntity]);
      reconversionProjectRepository._setReconversionProjects([
        buildReconversionProject({ id: reconversionProjectProps.id }),
      ]);

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
      );
      const result = await usecase.execute({ reconversionProjectProps });
      expect(result.isFailure()).toBe(true);
      const failureResult = result as FailureResult<"ReconversionProjectAlreadyExists">;
      expect(failureResult.getError()).toBe("ReconversionProjectAlreadyExists");
    });
  });

  describe("Success cases", () => {
    describe("Photovoltaic power station", () => {
      it.each([
        { case: "with minimal data", props: buildMinimalReconversionProjectProps() },
        {
          case: "with no costs and no revenues",
          props: buildMinimalReconversionProjectProps({
            yearlyProjectedCosts: [],
            yearlyProjectedRevenues: [],
          }),
        },
        { case: "with exhaustive data", props: buildExhaustiveReconversionProjectProps() },
      ])("Can create a reconversion project $case", async ({ props }) => {
        const siteEntity: SiteEntity = {
          ...buildFriche({ id: props.relatedSiteId }),
          createdAt: fakeNow,
          createdBy: "user-123",
          creationMode: "custom",
        };
        siteRepository._setSites([siteEntity]);

        const usecase = new CreateReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
        );
        const result = await usecase.execute({ reconversionProjectProps: props });

        expect(result.isSuccess()).toBe(true);
        const savedReconversionProjects = reconversionProjectRepository._getReconversionProjects();

        expect(savedReconversionProjects).toEqual([
          { ...props, createdAt: fakeNow, creationMode: "custom" },
        ]);
      });
    });
    describe("Urban project", () => {
      it.each([
        {
          case: "nominal case",
          props: buildUrbanProjectReconversionProjectProps(),
        },
      ])("Can create an urban reconversion project $case", async ({ props }) => {
        const siteEntity: SiteEntity = {
          ...buildFriche({ id: props.relatedSiteId }),
          createdAt: fakeNow,
          createdBy: "user-123",
          creationMode: "custom",
        };
        siteRepository._setSites([siteEntity]);

        const usecase = new CreateReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
        );
        const result = await usecase.execute({ reconversionProjectProps: props });

        expect(result.isSuccess()).toBe(true);
        const savedReconversionProjects = reconversionProjectRepository._getReconversionProjects();

        expect(savedReconversionProjects).toEqual([
          { ...props, createdAt: fakeNow, creationMode: "custom" },
        ]);
      });
    });
  });
});
