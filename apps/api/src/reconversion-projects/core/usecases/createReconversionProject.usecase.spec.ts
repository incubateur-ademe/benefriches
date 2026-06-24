/* oxlint-disable typescript-eslint/no-unsafe-assignment */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { FailureResult } from "src/shared-kernel/result";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";
import { buildFriche } from "src/sites/core/models/site.mock";
import { SiteEntity } from "src/sites/core/models/siteEntity";

import {
  RECONVERSION_PROJECT_CREATED,
  ReconversionProjectCreatedEvent,
} from "../events/reconversionProjectCreated.event";
import { ReconversionProjectSaveDto } from "../model/reconversionProject";
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
  let uuidGenerator: UidGenerator;
  let eventPublisher: InMemoryEventPublisher;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    siteRepository = new InMemorySitesRepository();
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
    uuidGenerator = new RandomUuidGenerator();
    eventPublisher = new InMemoryEventPublisher();
  });

  describe("Error cases", () => {
    describe("Mandatory input data", () => {
      for (const mandatoryField of [
        "id",
        "name",
        "createdBy",
        "relatedSiteId",
        "developmentPlan",
        "soilsDistribution",
        "yearlyProjectedCosts",
        "yearlyProjectedRevenues",
        "projectPhase",
      ]) {
        it(`Cannot create a reconversion project without providing ${mandatoryField}`, async () => {
          const reconversionProjectProps = buildMinimalReconversionProjectProps(); // @ts-expect-error dynamic delete
          // oxlint-disable-next-line typescript/no-dynamic-delete
          delete reconversionProjectProps[mandatoryField];

          const usecase = new CreateReconversionProjectUseCase(
            dateProvider,
            siteRepository,
            reconversionProjectRepository,
            uuidGenerator,
            eventPublisher,
          );

          const result = await usecase.execute({ reconversionProjectProps });
          assert.strictEqual(result.isFailure(), true);
          const failureResult = result as FailureResult<
            "ValidationError",
            { fieldErrors: Record<string, string[]> }
          >;
          assert.strictEqual(failureResult.getError(), "ValidationError");
          const issues = failureResult.getIssues();
          assert.ok(issues !== undefined);
          assert.ok(issues?.fieldErrors !== undefined);
          assert.strictEqual(eventPublisher.events.length, 0);
        });
      }
    });

    it("Cannot create a reconversion project on a non-existing site", async () => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
        uuidGenerator,
        eventPublisher,
      );
      const result = await usecase.execute({ reconversionProjectProps });
      assert.strictEqual(result.isFailure(), true);
      const failureResult = result as FailureResult<"ValidationError">;
      assert.strictEqual(failureResult.getError(), "SiteNotFound");
      assert.strictEqual(eventPublisher.events.length, 0);
    });

    it("Cannot create a reconversion project with existing id", async () => {
      const reconversionProjectProps = buildMinimalReconversionProjectProps();

      const siteEntity: SiteEntity = {
        ...buildFriche({ id: reconversionProjectProps.relatedSiteId }),
        createdAt: fakeNow,
        createdBy: "user-123",
        creationMode: "custom",
        status: "active",
      };
      siteRepository._setSites([siteEntity]);
      reconversionProjectRepository._setReconversionProjects([
        buildReconversionProject({ id: reconversionProjectProps.id }),
      ]);

      const usecase = new CreateReconversionProjectUseCase(
        dateProvider,
        siteRepository,
        reconversionProjectRepository,
        uuidGenerator,
        eventPublisher,
      );
      const result = await usecase.execute({ reconversionProjectProps });
      assert.strictEqual(result.isFailure(), true);
      const failureResult = result as FailureResult<"ReconversionProjectAlreadyExists">;
      assert.strictEqual(failureResult.getError(), "ReconversionProjectAlreadyExists");
      assert.strictEqual(eventPublisher.events.length, 0);
    });
  });

  describe("Success cases", () => {
    describe("Photovoltaic power station", () => {
      for (const { case: caseName, props } of [
        { case: "with minimal data", props: buildMinimalReconversionProjectProps() },
        {
          case: "with no costs and no revenues",
          props: buildMinimalReconversionProjectProps({
            yearlyProjectedCosts: [],
            yearlyProjectedRevenues: [],
          }),
        },
        { case: "with exhaustive data", props: buildExhaustiveReconversionProjectProps() },
      ]) {
        it(`Can create a reconversion project ${caseName}`, async () => {
          const siteEntity: SiteEntity = {
            ...buildFriche({ id: props.relatedSiteId }),
            createdAt: fakeNow,
            createdBy: "user-123",
            creationMode: "custom",
            status: "active",
          };
          siteRepository._setSites([siteEntity]);

          const usecase = new CreateReconversionProjectUseCase(
            dateProvider,
            siteRepository,
            reconversionProjectRepository,
            uuidGenerator,
            eventPublisher,
          );
          const result = await usecase.execute({ reconversionProjectProps: props });

          assert.strictEqual(result.isSuccess(), true);
          const savedReconversionProjects =
            reconversionProjectRepository._getReconversionProjects();

          assert.deepStrictEqual(savedReconversionProjects, [
            { ...props, createdAt: fakeNow, creationMode: "custom", status: "active" },
          ] satisfies ReconversionProjectSaveDto[]);

          const projectId = savedReconversionProjects[0]!.id;
          assert.strictEqual(eventPublisher.events.length, 1);
          assert.deepStrictEqual(eventPublisher.events[0], {
            id: eventPublisher.events[0]!.id,
            name: RECONVERSION_PROJECT_CREATED,
            payload: {
              reconversionProjectId: projectId,
              siteId: props.relatedSiteId,
              createdBy: props.createdBy,
            },
          } satisfies ReconversionProjectCreatedEvent);
        });
      }
    });

    describe("Urban project", () => {
      for (const { case: caseName, props } of [
        {
          case: "nominal case",
          props: buildUrbanProjectReconversionProjectProps(),
        },
      ]) {
        it(`Can create an urban reconversion project ${caseName}`, async () => {
          const siteEntity: SiteEntity = {
            ...buildFriche({ id: props.relatedSiteId }),
            createdAt: fakeNow,
            createdBy: "user-123",
            creationMode: "custom",
            status: "active",
          };
          siteRepository._setSites([siteEntity]);

          const usecase = new CreateReconversionProjectUseCase(
            dateProvider,
            siteRepository,
            reconversionProjectRepository,
            uuidGenerator,
            eventPublisher,
          );
          const result = await usecase.execute({ reconversionProjectProps: props });

          assert.strictEqual(result.isSuccess(), true);
          const savedReconversionProjects =
            reconversionProjectRepository._getReconversionProjects();

          assert.deepStrictEqual(savedReconversionProjects, [
            { ...props, createdAt: fakeNow, creationMode: "custom", status: "active" },
          ] satisfies ReconversionProjectSaveDto[]);

          const projectId = savedReconversionProjects[0]!.id;
          assert.strictEqual(eventPublisher.events.length, 1);
          assert.deepStrictEqual(eventPublisher.events[0], {
            id: eventPublisher.events[0]!.id,
            name: RECONVERSION_PROJECT_CREATED,
            payload: {
              reconversionProjectId: projectId,
              siteId: props.relatedSiteId,
              createdBy: props.createdBy,
            },
          } satisfies ReconversionProjectCreatedEvent);
        });
      }
    });
  });
});
