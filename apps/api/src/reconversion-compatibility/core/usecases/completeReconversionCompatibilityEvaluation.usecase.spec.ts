import { InMemoryReconversionCompatibilityEvaluationRepository } from "src/reconversion-compatibility/adapters/secondary/reconversion-compatibility-evaluation/InMemoryReconversionCompatibilityEvaluationRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { FailureResult } from "src/shared-kernel/result";

import { ReconversionCompatibilityEvaluation } from "../reconversionCompatibilityEvaluation";
import { CompleteReconversionCompatibilityEvaluationUseCase } from "./completeReconversionCompatibilityEvaluation.usecase";

describe("CompleteReconversionCompatibilityEvaluationUseCase", () => {
  const fakeNow = new Date("2024-01-10T10:00:00Z");
  let repository: InMemoryReconversionCompatibilityEvaluationRepository;
  let dateProvider: DeterministicDateProvider;
  let uidGenerator: DeterministicUuidGenerator;
  let eventPublisher: InMemoryEventPublisher;

  beforeEach(() => {
    repository = new InMemoryReconversionCompatibilityEvaluationRepository();
    dateProvider = new DeterministicDateProvider(fakeNow);
    uidGenerator = new DeterministicUuidGenerator();
    uidGenerator.nextUuids("event-id-1");
    eventPublisher = new InMemoryEventPublisher();
  });

  it("completes a reconversion compatibility evaluation and emits an event", async () => {
    const existingEvaluation: ReconversionCompatibilityEvaluation = {
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
      status: "started",
      mutafrichesEvaluationId: null,
      createdAt: new Date("2024-01-10T09:00:00Z"),
      completedAt: null,
      projectCreations: [],
    };

    repository.evaluations = [existingEvaluation];

    const usecase = new CompleteReconversionCompatibilityEvaluationUseCase(
      repository,
      dateProvider,
      uidGenerator,
      eventPublisher,
    );

    await usecase.execute({
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      mutafrichesId: "mutafriches-123",
    });

    expect(repository.evaluations).toEqual<ReconversionCompatibilityEvaluation[]>([
      {
        id: existingEvaluation.id,
        createdBy: existingEvaluation.createdBy,
        status: "completed",
        mutafrichesEvaluationId: "mutafriches-123",
        createdAt: existingEvaluation.createdAt,
        completedAt: fakeNow,
        projectCreations: existingEvaluation.projectCreations,
      },
    ]);

    expect(eventPublisher.events).toEqual([
      {
        id: "event-id-1",
        name: "reconversion-compatibility-evaluation.completed",
        payload: {
          evaluationId: "bdea66f3-e911-4a32-a829-cab382bc34ea",
          mutafrichesId: "mutafriches-123",
        },
      },
    ]);
  });

  it("throws an error when evaluation does not exist", async () => {
    const usecase = new CompleteReconversionCompatibilityEvaluationUseCase(
      repository,
      dateProvider,
      uidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      id: "non-existent-id",
      mutafrichesId: "mutafriches-123",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"EvaluationNotFound">).getError()).toBe("EvaluationNotFound");
  });

  it("throws an error when evaluation is already completed", async () => {
    const completedEvaluation: ReconversionCompatibilityEvaluation = {
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
      status: "completed",
      mutafrichesEvaluationId: "mutafriches-456",
      createdAt: new Date("2024-01-10T09:00:00Z"),
      completedAt: new Date("2024-01-10T09:30:00Z"),
      projectCreations: [],
    };

    repository.evaluations = [completedEvaluation];

    const usecase = new CompleteReconversionCompatibilityEvaluationUseCase(
      repository,
      dateProvider,
      uidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      mutafrichesId: "mutafriches-123",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"EvaluationCannotBeCompleted">).getError()).toBe(
      "EvaluationCannotBeCompleted",
    );
  });

  it("throws an error when evaluation has projects created", async () => {
    const evaluationWithProjects: ReconversionCompatibilityEvaluation = {
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
      status: "has_projects_created",
      mutafrichesEvaluationId: "mutafriches-456",
      createdAt: new Date("2024-01-10T09:00:00Z"),
      completedAt: new Date("2024-01-10T09:30:00Z"),
      projectCreations: [
        {
          reconversionProjectId: "project-123",
          createdAt: new Date("2024-01-10T09:45:00Z"),
        },
      ],
    };

    repository.evaluations = [evaluationWithProjects];

    const usecase = new CompleteReconversionCompatibilityEvaluationUseCase(
      repository,
      dateProvider,
      uidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      mutafrichesId: "mutafriches-123",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"EvaluationCannotBeCompleted">).getError()).toBe(
      "EvaluationCannotBeCompleted",
    );
  });
});
