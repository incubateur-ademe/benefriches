import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { InMemoryReconversionCompatibilityEvaluationRepository } from "src/reconversion-compatibility/adapters/secondary/reconversion-compatibility-evaluation/InMemoryReconversionCompatibilityEvaluationRepository";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import type { FailureResult } from "src/shared-kernel/result";

import type { ReconversionCompatibilityEvaluation } from "../reconversionCompatibilityEvaluation";
import { AddRelatedSiteToReconversionCompatibilityEvaluationUseCase } from "./addRelatedSiteToReconversionCompatibilityEvaluation.usecase";

describe("AddRelatedSiteToReconversionCompatibilityEvaluationUseCase", () => {
  const completedAt = new Date("2024-01-10T10:00:00Z");
  const startedAt = new Date("2024-01-10T09:00:00Z");
  let repository: InMemoryReconversionCompatibilityEvaluationRepository;
  let uidGenerator: DeterministicUuidGenerator;
  let eventPublisher: InMemoryEventPublisher;

  beforeEach(() => {
    repository = new InMemoryReconversionCompatibilityEvaluationRepository();
    uidGenerator = new DeterministicUuidGenerator();
    uidGenerator.nextUuids("event-id-1");
    eventPublisher = new InMemoryEventPublisher();
  });

  it("adds a site creation to a completed evaluation and emits an event", async () => {
    const completedEvaluation: ReconversionCompatibilityEvaluation = {
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
      status: "completed",
      mutafrichesEvaluationId: "mutafriches-123",
      createdAt: startedAt,
      completedAt: completedAt,
      relatedSiteId: null,
    };

    repository.evaluations = [completedEvaluation];

    const usecase = new AddRelatedSiteToReconversionCompatibilityEvaluationUseCase(
      repository,
      uidGenerator,
      eventPublisher,
    );

    await usecase.execute({
      evaluationId: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      relatedSiteId: "site-123",
    });

    assert.deepStrictEqual(repository.evaluations, [
      {
        id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
        createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
        status: "related_site_created",
        mutafrichesEvaluationId: "mutafriches-123",
        createdAt: startedAt,
        completedAt: completedAt,
        relatedSiteId: "site-123",
      },
    ] satisfies ReconversionCompatibilityEvaluation[]);

    assert.deepStrictEqual(eventPublisher.events, [
      {
        id: "event-id-1",
        name: "reconversion-compatibility-evaluation.site-created",
        payload: {
          evaluationId: "bdea66f3-e911-4a32-a829-cab382bc34ea",
          relatedSiteId: "site-123",
        },
      },
    ]);
  });

  it("cannot add site creation if it already exists", async () => {
    const evaluationWithRelatedSite: ReconversionCompatibilityEvaluation = {
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
      status: "related_site_created",
      mutafrichesEvaluationId: "mutafriches-123",
      createdAt: startedAt,
      completedAt: completedAt,
      relatedSiteId: "site-1234",
    };

    repository.evaluations = [evaluationWithRelatedSite];

    const usecase = new AddRelatedSiteToReconversionCompatibilityEvaluationUseCase(
      repository,
      uidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      evaluationId: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      relatedSiteId: "site-456",
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"RelatedSiteAlreadyExists">).getError(),
      "RelatedSiteAlreadyExists",
    );
  });

  it("throws an error when evaluation does not exist", async () => {
    const usecase = new AddRelatedSiteToReconversionCompatibilityEvaluationUseCase(
      repository,
      uidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      evaluationId: "non-existent-id",
      relatedSiteId: "site-123",
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"EvaluationNotFound">).getError(),
      "EvaluationNotFound",
    );
  });
});
