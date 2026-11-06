import { z } from "zod";

import { DateProvider } from "src/shared-kernel/dateProvider";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UidGenerator } from "src/shared-kernel/uidGenerator";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectCreatedEvent } from "../events/reconversionProjectCreated.event";
import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import {
  ReconversionProjectSavePropsDto,
  domainSaveReconversionProjectPropsSchema,
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

export class CreateReconversionProjectUseCase implements UseCase<
  Request,
  CreateReconversionProjectResult
> {
  private readonly dateProvider: DateProvider;
  private readonly siteRepository: SiteRepository;
  private readonly reconversionProjectRepository: ReconversionProjectRepository;
  private readonly uuidGenerator: UidGenerator;
  private readonly eventPublisher: DomainEventPublisher;
  constructor(
    dateProvider: DateProvider,
    siteRepository: SiteRepository,
    reconversionProjectRepository: ReconversionProjectRepository,
    uuidGenerator: UidGenerator,
    eventPublisher: DomainEventPublisher,
  ) {
    this.dateProvider = dateProvider;
    this.siteRepository = siteRepository;
    this.reconversionProjectRepository = reconversionProjectRepository;
    this.uuidGenerator = uuidGenerator;
    this.eventPublisher = eventPublisher;
  }

  async execute({ reconversionProjectProps }: Request): Promise<CreateReconversionProjectResult> {
    const parseResult =
      await domainSaveReconversionProjectPropsSchema.safeParseAsync(reconversionProjectProps);
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

    try {
      await this.reconversionProjectRepository.save({
        ...parsedReconversionProject,
        createdAt: this.dateProvider.now(),
        creationMode: "custom",
        status: "active",
      });
    } catch (error) {
      // A concurrent request with the same id (e.g. a double submit) can pass the existence
      // check above and save first: the save then fails on the primary key.
      if (await this.reconversionProjectRepository.existsWithId(parsedReconversionProject.id)) {
        return fail("ReconversionProjectAlreadyExists");
      }
      throw error;
    }

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
