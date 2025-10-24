import { v4 as uuid } from "uuid";

import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { FailureResult } from "src/shared-kernel/result";

import {
  buildMinimalReconversionProjectProps,
  buildReconversionProject,
} from "../model/reconversionProject.mock";
import { DuplicateReconversionProjectUseCase } from "./duplicateReconversionProject.usecase";

describe("DuplicateReconversionProject use case", () => {
  let dateProvider: DateProvider;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  let uuidGenerator: DeterministicUuidGenerator;
  let eventPublisher: InMemoryEventPublisher;
  const fakeNow = new Date("2024-01-10T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
    uuidGenerator = new DeterministicUuidGenerator();
    uuidGenerator.nextUuids("event-id-1");
    eventPublisher = new InMemoryEventPublisher();
  });

  it("fails when user is not the creator of the source project", async () => {
    const sourceProjectId = uuid();
    const newProjectId = uuid();
    const userId = uuid();
    const sourceProject = buildReconversionProject({
      ...buildMinimalReconversionProjectProps(),
      id: sourceProjectId,
      createdBy: uuid(),
      name: "Original Project",
    });

    reconversionProjectRepository._setReconversionProjects([sourceProject]);

    const usecase = new DuplicateReconversionProjectUseCase(
      reconversionProjectRepository,
      dateProvider,
      uuidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      sourceProjectId,
      newProjectId,
      userId,
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"UserNotAuthorized">).getError()).toBe("UserNotAuthorized");

    const savedProjects = reconversionProjectRepository._getReconversionProjects();
    expect(savedProjects).toHaveLength(1);
  });

  it("fails when source project does not exist", async () => {
    const usecase = new DuplicateReconversionProjectUseCase(
      reconversionProjectRepository,
      dateProvider,
      uuidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      sourceProjectId: "non-existent-id",
      newProjectId: uuid(),
      userId: uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"SourceReconversionProjectNotFound">).getError()).toBe(
      "SourceReconversionProjectNotFound",
    );
  });

  it("duplicates a reconversion project successfully", async () => {
    const sourceProjectId = uuid();
    const newProjectId = uuid();
    const userId = uuid();
    const sourceProject = buildReconversionProject({
      ...buildMinimalReconversionProjectProps(),
      id: sourceProjectId,
      createdBy: userId,
      name: "Projet 1",
      createdAt: new Date("2024-01-05T10:00:00"),
    });

    reconversionProjectRepository._setReconversionProjects([sourceProject]);

    const usecase = new DuplicateReconversionProjectUseCase(
      reconversionProjectRepository,
      dateProvider,
      uuidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({
      sourceProjectId,
      newProjectId,
      userId,
    });
    expect(result.isSuccess()).toBe(true);

    const savedProjects = reconversionProjectRepository._getReconversionProjects();
    expect(savedProjects).toHaveLength(2);

    const duplicatedProject = savedProjects[1];
    expect(duplicatedProject).toEqual({
      ...sourceProject,
      id: newProjectId,
      name: "Copie de Projet 1",
      createdAt: fakeNow,
      createdBy: userId,
      creationMode: "duplicated",
    });

    expect(eventPublisher.events).toEqual([
      {
        id: "event-id-1",
        name: "reconversion-project.duplicated",
        payload: {
          sourceProjectId,
          newProjectId,
          userId,
        },
      },
    ]);
  });
});
