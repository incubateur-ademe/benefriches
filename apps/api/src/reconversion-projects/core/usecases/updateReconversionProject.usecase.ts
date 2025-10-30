import { updateReconversionProjectPropsSchema } from "shared";
import { z } from "zod";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import { ReconversionProjectUpdateInputProps } from "../model/reconversionProject";

type Request = {
  reconversionProjectId: string;
  reconversionProjectProps: ReconversionProjectUpdateInputProps;
  userId: string;
};

type UpdateReconversionProjectResult = TResult<
  void,
  "ValidationError" | "SiteNotFound" | "ReconversionProjectNotFound" | "UserNotAuthorized",
  { fieldErrors: Record<string, string[]> } | undefined
>;

export class UpdateReconversionProjectUseCase
  implements UseCase<Request, UpdateReconversionProjectResult>
{
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
      await updateReconversionProjectPropsSchema.safeParseAsync(reconversionProjectProps);

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
