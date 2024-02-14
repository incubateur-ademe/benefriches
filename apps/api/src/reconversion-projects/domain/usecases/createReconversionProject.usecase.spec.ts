/* eslint-disable jest/no-conditional-expect */
import { z } from "zod";
import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/reconversion-project-repository/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemorySiteRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";
import { buildMinimalSite } from "src/sites/domain/models/site.mock";
import {
  buildMinimalReconversionProjectProps,
  buildReconversionProject,
} from "../model/reconversionProject.mock";
import {
  CreateReconversionProjectUseCase,
  DateProvider,
} from "./createReconversionProject.usecase";

describe("CreateReconversionProject Use Case", () => {
  let dateProvider: DateProvider;
  let siteRepository: InMemorySiteRepository;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  const getZodIssues = (err: unknown) => {
    if (err instanceof z.ZodError) {
      return err.issues;
    }
    throw new Error("Not a ZodError");
  };

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    siteRepository = new InMemorySiteRepository();
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
  });

  describe("Mandatory input data", () => {
    it.each([
      "id",
      "name",
      "relatedSiteId",
      "developmentPlans",
      "soilsDistribution",
      "yearlyProjectedCosts",
      "yearlyProjectedRevenues",
    ])("Cannot create a reconversion project without providing %s", async (mandatoryField) => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps(); // @ts-expect-error dynamic delete
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete reconversionProjectProps[mandatoryField];

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
      );

      expect.assertions(2);
      try {
        await usecase.execute({ reconversionProjectProps });
      } catch (err) {
        const zIssues = getZodIssues(err);
        expect(zIssues.length).toEqual(1);
        expect(zIssues[0].path).toEqual([mandatoryField]);
      }
    });

    it("Cannot create a reconversion project on a non-existing site", async () => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
      );
      await expect(usecase.execute({ reconversionProjectProps })).rejects.toThrow(
        `Site with id ${reconversionProjectProps.relatedSiteId} does not exist`,
      );
    });

    it("Cannot create a reconversion project with existing id", async () => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      siteRepository._setSites([buildMinimalSite({ id: reconversionProjectProps.relatedSiteId })]);
      reconversionProjectRepository._setReconversionProjects([
        buildReconversionProject({ id: reconversionProjectProps.id }),
      ]);

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
      );
      await expect(usecase.execute({ reconversionProjectProps })).rejects.toThrow(
        `ReconversionProject with id ${reconversionProjectProps.id} already exists`,
      );
    });

    it("Can create a reconversion project", async () => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      siteRepository._setSites([buildMinimalSite({ id: reconversionProjectProps.relatedSiteId })]);

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
      );
      await usecase.execute({ reconversionProjectProps });

      const savedReconversionProjects = reconversionProjectRepository._getReconversionProjects();

      expect(savedReconversionProjects).toEqual([
        { ...reconversionProjectProps, createdAt: fakeNow },
      ]);
    });
  });
});
