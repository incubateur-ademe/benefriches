import { InMemoryReconversionCompatibilityEvaluationRepository } from "src/reconversion-compatibility/adapters/secondary/reconversion-compatibility-evaluation/InMemoryReconversionCompatibilityEvaluationRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { FailureResult } from "src/shared-kernel/result";

import { ReconversionCompatibilityEvaluation } from "../reconversionCompatibilityEvaluation";
import { AddProjectCreationToReconversionCompatibilityEvaluationUseCase } from "./addProjectCreationToReconversionCompatibilityEvaluation.usecase";

describe("AddProjectCreationToReconversionCompatibilityEvaluationUseCase", () => {
  const fakeNow = new Date("2024-01-10T11:00:00Z");
  const completedAt = new Date("2024-01-10T10:00:00Z");
  const startedAt = new Date("2024-01-10T09:00:00Z");
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

  it("adds a project creation to a completed evaluation and emits an event", async () => {
    const completedEvaluation: ReconversionCompatibilityEvaluation = {
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
      status: "completed",
      mutafrichesEvaluationId: "mutafriches-123",
      createdAt: startedAt,
      completedAt: completedAt,
      projectCreations: [],
    };

    repository.evaluations = [completedEvaluation];

    const usecase = new AddProjectCreationToReconversionCompatibilityEvaluationUseCase(
      repository,
      dateProvider,
      uidGenerator,
      eventPublisher,
    );

    await usecase.execute({
      evaluationId: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      reconversionProjectId: "project-123",
    });

    expect(repository.evaluations).toEqual<ReconversionCompatibilityEvaluation[]>([
      {
        id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
        createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
        status: "has_projects_created",
        mutafrichesEvaluationId: "mutafriches-123",
        createdAt: startedAt,
        completedAt: completedAt,
        projectCreations: [
          {
            reconversionProjectId: "project-123",
            createdAt: fakeNow,
          },
        ],
      },
    ]);

    expect(eventPublisher.events).toEqual([
      {
        id: "event-id-1",
        name: "reconversion-compatibility-evaluation.project-created",
        payload: {
          evaluationId: "bdea66f3-e911-4a32-a829-cab382bc34ea",
          reconversionProjectId: "project-123",
        },
      },
    ]);
  });

  it("can add multiple projects creations to the same evaluation", async () => {
    const evaluationWithOneProject: ReconversionCompatibilityEvaluation = {
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
      status: "has_projects_created",
      mutafrichesEvaluationId: "mutafriches-123",
      createdAt: startedAt,
      completedAt: completedAt,
      projectCreations: [
        {
          reconversionProjectId: "project-123",
          createdAt: new Date("2024-01-10T10:30:00Z"),
        },
      ],
    };

    repository.evaluations = [evaluationWithOneProject];

    const usecase = new AddProjectCreationToReconversionCompatibilityEvaluationUseCase(
      repository,
      dateProvider,
      uidGenerator,
      eventPublisher,
    );

    await usecase.execute({
      evaluationId: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      reconversionProjectId: "project-456",
    });

    expect(repository.evaluations[0]?.projectCreations).toHaveLength(2);
    expect(repository.evaluations[0]?.projectCreations[1]).toEqual({
      reconversionProjectId: "project-456",
      createdAt: fakeNow,
    });
  });

  it("throws an error when evaluation does not exist", async () => {
    const usecase = new AddProjectCreationToReconversionCompatibilityEvaluationUseCase(
      repository,
      dateProvider,
      uidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      evaluationId: "non-existent-id",
      reconversionProjectId: "project-123",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"EvaluationNotFound">).getError()).toBe("EvaluationNotFound");
  });
});
