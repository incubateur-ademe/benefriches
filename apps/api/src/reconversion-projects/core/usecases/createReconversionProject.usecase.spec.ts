/* eslint-disable jest/no-conditional-expect */
import { z } from "zod";

import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";
import { buildMinimalSite } from "src/sites/core/models/site.mock";

import {
  buildExhaustiveReconversionProjectProps,
  buildMinimalReconversionProjectProps,
  buildReconversionProject,
} from "../model/reconversionProject.mock";
import { CreateReconversionProjectUseCase } from "./createReconversionProject.usecase";

describe("CreateReconversionProject Use Case", () => {
  let dateProvider: DateProvider;
  let siteRepository: InMemorySitesRepository;
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
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete reconversionProjectProps[mandatoryField];

        const usecase = new CreateReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
        );

        expect.assertions(3);
        try {
          await usecase.execute({ reconversionProjectProps });
        } catch (err) {
          const zIssues = getZodIssues(err);
          expect(zIssues.length).toEqual(1);
          expect(zIssues[0]?.path).toEqual([mandatoryField]);
          expect(zIssues[0]?.code).toEqual("invalid_type");
        }
      });
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
  });

  describe("Success cases", () => {
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
      siteRepository._setSites([buildMinimalSite({ id: props.relatedSiteId })]);

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
      );
      await usecase.execute({ reconversionProjectProps: props });

      const savedReconversionProjects = reconversionProjectRepository._getReconversionProjects();

      expect(savedReconversionProjects).toEqual([
        { ...props, createdAt: fakeNow, creationMode: "custom" },
      ]);
    });
  });
});
