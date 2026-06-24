import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { TResult } from "src/shared-kernel/result";
import { fail, success } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";

type Request = {
  projectId: string;
  userId: string;
};

type ArchiveReconversionProjectResult = TResult<
  void,
  "ReconversionProjectNotFound" | "UserNotAuthorized"
>;

export class ArchiveReconversionProjectUseCase implements UseCase<
  Request,
  ArchiveReconversionProjectResult
> {
  constructor(
    private readonly repository: ReconversionProjectRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ projectId, userId }: Request): Promise<ArchiveReconversionProjectResult> {
    const project = await this.repository.getById(projectId);

    if (!project) return fail("ReconversionProjectNotFound");
    if (project.createdBy !== userId) return fail("UserNotAuthorized");

    await this.repository.patch(projectId, {
      status: "archived",
      updatedAt: this.dateProvider.now(),
    });

    return success();
  }
}
