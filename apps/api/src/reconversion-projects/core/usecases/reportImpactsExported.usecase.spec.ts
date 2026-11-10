import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";

import {
  RECONVERSION_PROJECT_IMPACTS_EXPORTED,
  type ReconversionProjectImpactsExportedEvent,
} from "../events/reconversionProjectImpactsExported.event";
import {
  buildMinimalReconversionProjectProps,
  buildReconversionProject,
} from "../model/reconversionProject.mock";
import { ReportImpactsExportedUseCase } from "./reportImpactsExported.usecase";

const sections = {
  siteFeatures: true,
  projectFeatures: true,
  economicBalance: false,
  socioEconomicImpacts: true,
  socialImpacts: false,
  environmentalImpacts: true,
  aboutBenefriches: false,
};

describe("ReportImpactsExported use case", () => {
  it("publishes an impacts exported event with the user, project, format and sections", async () => {
    const reconversionProjectRepository = new InMemoryReconversionProjectRepository();
    reconversionProjectRepository._setReconversionProjects([
      buildReconversionProject({
        ...buildMinimalReconversionProjectProps(),
        id: "project-id",
        createdBy: "creator-id",
      }),
    ]);
    const uuidGenerator = new DeterministicUuidGenerator();
    uuidGenerator.nextUuids("event-id");
    const eventPublisher = new InMemoryEventPublisher();
    const usecase = new ReportImpactsExportedUseCase(
      reconversionProjectRepository,
      uuidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      userId: "another-user-id",
      reconversionProjectId: "project-id",
      format: "pdf",
      sections,
    });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual(eventPublisher.events, [
      {
        id: "event-id",
        name: RECONVERSION_PROJECT_IMPACTS_EXPORTED,
        payload: {
          userId: "another-user-id",
          reconversionProjectId: "project-id",
          format: "pdf",
          sections,
        },
      } satisfies ReconversionProjectImpactsExportedEvent,
    ]);
  });

  it("fails with ReconversionProjectNotFound and publishes nothing when the project does not exist", async () => {
    const uuidGenerator = new DeterministicUuidGenerator();
    uuidGenerator.nextUuids("event-id");
    const eventPublisher = new InMemoryEventPublisher();
    const usecase = new ReportImpactsExportedUseCase(
      new InMemoryReconversionProjectRepository(),
      uuidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      userId: "user-id",
      reconversionProjectId: "unknown-project-id",
      format: "pdf",
      sections,
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(result.isFailure() && result.getError(), "ReconversionProjectNotFound");
    assert.strictEqual(eventPublisher.events.length, 0);
  });
});
