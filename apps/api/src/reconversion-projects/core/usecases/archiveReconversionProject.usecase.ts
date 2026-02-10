import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";

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
