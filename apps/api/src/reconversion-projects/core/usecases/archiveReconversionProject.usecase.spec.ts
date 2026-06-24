import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
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

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"UserNotAuthorized">).getError(),
      "UserNotAuthorized",
    );

    const projects = reconversionProjectRepository._getReconversionProjects();
    assert.deepStrictEqual(projects[0]?.status, "active");
    assert.deepStrictEqual(projects[0]?.updatedAt, undefined);
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

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"ReconversionProjectNotFound">).getError(),
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
    assert.strictEqual(result.isSuccess(), true);

    const projects = reconversionProjectRepository._getReconversionProjects();

    assert.deepStrictEqual(projects[0], {
      ...sourceProject,
      status: "archived",
      updatedAt: fakeNow,
    });
  });
});
