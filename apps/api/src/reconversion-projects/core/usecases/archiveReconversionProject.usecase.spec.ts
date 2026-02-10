import { v4 as uuid } from "uuid";

import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { FailureResult } from "src/shared-kernel/result";

import {
  buildMinimalReconversionProjectProps,
  buildReconversionProject,
} from "../model/reconversionProject.mock";
import { ArchiveReconversionProjectUseCase } from "./archiveReconversionProject.usecase";

describe("ArchiveReconversionProject use case", () => {
  let dateProvider: DateProvider;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  const fakeNow = new Date("2024-01-10T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
  });

  it("fails when user is not the creator of the project", async () => {
    const projectId = uuid();
    const userId = uuid();
    const project = buildReconversionProject({
      ...buildMinimalReconversionProjectProps(),
      id: projectId,
      createdBy: uuid(),
      name: "Original Project",
    });

    reconversionProjectRepository._setReconversionProjects([project]);

    const usecase = new ArchiveReconversionProjectUseCase(
      reconversionProjectRepository,
      dateProvider,
    );

    const result = await usecase.execute({
      projectId,
      userId,
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"UserNotAuthorized">).getError()).toBe("UserNotAuthorized");

    const projects = reconversionProjectRepository._getReconversionProjects();
    expect(projects[0]?.status).toEqual("active");
    expect(projects[0]?.updatedAt).toEqual(undefined);
  });

  it("fails when project does not exist", async () => {
    const usecase = new ArchiveReconversionProjectUseCase(
      reconversionProjectRepository,
      dateProvider,
    );

    const result = await usecase.execute({
      projectId: "non-existent-id",
      userId: uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"ReconversionProjectNotFound">).getError()).toBe(
      "ReconversionProjectNotFound",
    );
  });

  it("archive a reconversion project successfully", async () => {
    const projectId = uuid();
    const userId = uuid();
    const sourceProject = buildReconversionProject({
      ...buildMinimalReconversionProjectProps(),
      id: projectId,
      createdBy: userId,
      name: "Projet 1",
      createdAt: new Date("2024-01-05T10:00:00"),
    });

    reconversionProjectRepository._setReconversionProjects([sourceProject]);

    const usecase = new ArchiveReconversionProjectUseCase(
      reconversionProjectRepository,
      dateProvider,
    );

    const result = await usecase.execute({
      projectId,
      userId,
    });
    expect(result.isSuccess()).toBe(true);

    const projects = reconversionProjectRepository._getReconversionProjects();

    expect(projects[0]).toEqual({
      ...sourceProject,
      status: "archived",
      updatedAt: fakeNow,
    });
  });
});
