import { InMemoryReconversionCompatibilityEvaluationRepository } from "src/reconversion-compatibility/adapters/secondary/reconversion-compatibility-evaluation/InMemoryReconversionCompatibilityEvaluationRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";

import { ReconversionCompatibilityEvaluation } from "../reconversionCompatibilityEvaluation";
import { StartReconversionCompatibilityEvaluationUseCase } from "./startReconversionCompatibilityEvaluation.usecase";

describe("StartReconversionCompatibilityEvaluationUseCase", () => {
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

  it("starts a reconversion compatibility evaluation and emits an event", async () => {
    const usecase = new StartReconversionCompatibilityEvaluationUseCase(
      repository,
      dateProvider,
      uidGenerator,
      eventPublisher,
    );

    await usecase.execute({
      id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
      createdById: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
    });

    expect(repository.evaluations).toEqual<ReconversionCompatibilityEvaluation[]>([
      {
        id: "bdea66f3-e911-4a32-a829-cab382bc34ea",
        createdBy: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
        status: "started",
        mutafrichesEvaluationId: null,
        createdAt: fakeNow,
        completedAt: null,
        projectCreations: [],
      },
    ]);

    expect(eventPublisher.events).toEqual([
      {
        id: "event-id-1",
        name: "reconversion-compatibility-evaluation.started",
        payload: {
          evaluationId: "bdea66f3-e911-4a32-a829-cab382bc34ea",
          userId: "58090ca1-7680-4193-a3e8-89b7ed2bd6b8",
        },
      },
    ]);
  });
});
