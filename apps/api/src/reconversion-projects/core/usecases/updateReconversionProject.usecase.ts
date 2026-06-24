import { domainUpdateReconversionProjectPropsSchema } from "shared";
import { z } from "zod";

import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { TResult } from "src/shared-kernel/result";
import { fail, success } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import type { ReconversionProjectUpdatePropsDto } from "../model/reconversionProject";

type Request = {
  reconversionProjectId: string;
  reconversionProjectProps: ReconversionProjectUpdatePropsDto;
  userId: string;
};

type UpdateReconversionProjectResult = TResult<
  void,
  "ValidationError" | "ReconversionProjectNotFound" | "UserNotAuthorized",
  { fieldErrors: Record<string, string[]> } | undefined
>;

export class UpdateReconversionProjectUseCase implements UseCase<
  Request,
  UpdateReconversionProjectResult
> {
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute({
    reconversionProjectProps,
    reconversionProjectId,
    userId,
  }: Request): Promise<UpdateReconversionProjectResult> {
    const sourceProject = await this.reconversionProjectRepository.getById(reconversionProjectId);

    if (!sourceProject) return fail("ReconversionProjectNotFound");
    if (sourceProject.createdBy !== userId) return fail("UserNotAuthorized");

    const parseResult =
      await domainUpdateReconversionProjectPropsSchema.safeParseAsync(reconversionProjectProps);

    if (!parseResult.success) {
      return fail("ValidationError", {
        fieldErrors: z.flattenError(parseResult.error).fieldErrors,
      });
    }

    const parsedReconversionProject = parseResult.data;

    await this.reconversionProjectRepository.update({
      ...parsedReconversionProject,
      id: reconversionProjectId,
      updatedAt: this.dateProvider.now(),
    });

    return success();
  }
}
