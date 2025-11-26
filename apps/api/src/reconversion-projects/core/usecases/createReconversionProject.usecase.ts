import { z } from "zod";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectCreatedEvent } from "../events/reconversionProjectCreated.event";
import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import {
  ReconversionProjectSavePropsDto,
  saveReconversionProjectPropsSchema,
} from "../model/reconversionProject";

export interface SiteRepository {
  existsWithId(id: string): Promise<boolean>;
}

type Request = {
  reconversionProjectProps: ReconversionProjectSavePropsDto;
};

type CreateReconversionProjectResult = TResult<
  void,
  "ValidationError" | "SiteNotFound" | "ReconversionProjectAlreadyExists",
  { fieldErrors: Record<string, string[]> } | undefined
>;

export class CreateReconversionProjectUseCase
  implements UseCase<Request, CreateReconversionProjectResult>
{
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly siteRepository: SiteRepository,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({ reconversionProjectProps }: Request): Promise<CreateReconversionProjectResult> {
    const parseResult =
      await saveReconversionProjectPropsSchema.safeParseAsync(reconversionProjectProps);
    if (!parseResult.success) {
      return fail("ValidationError", {
        fieldErrors: z.flattenError(parseResult.error).fieldErrors,
      });
    }

    const parsedReconversionProject = parseResult.data;

    const doesRelatedSiteExist = await this.siteRepository.existsWithId(
      parsedReconversionProject.relatedSiteId,
    );
    if (!doesRelatedSiteExist) {
      return fail("SiteNotFound");
    }

    const doesReconversionProjectExist = await this.reconversionProjectRepository.existsWithId(
      parsedReconversionProject.id,
    );
    if (doesReconversionProjectExist) {
      return fail("ReconversionProjectAlreadyExists");
    }

    await this.reconversionProjectRepository.save({
      ...parsedReconversionProject,
      createdAt: this.dateProvider.now(),
      creationMode: "custom",
    });

    await this.eventPublisher.publish(
      createReconversionProjectCreatedEvent(this.uuidGenerator.generate(), {
        reconversionProjectId: parsedReconversionProject.id,
        siteId: parsedReconversionProject.relatedSiteId,
        createdBy: parsedReconversionProject.createdBy,
      }),
    );

    return success();
  }
}
