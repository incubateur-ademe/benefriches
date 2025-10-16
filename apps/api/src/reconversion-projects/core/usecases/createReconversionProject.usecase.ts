import { z } from "zod";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import {
  ReconversionProjectInputProps,
  saveReconversionProjectPropsSchema,
  saveReconversionProjectSchema,
} from "../model/reconversionProject";

export interface SiteRepository {
  existsWithId(id: string): Promise<boolean>;
}

export type ReconversionProjectProps = z.infer<typeof saveReconversionProjectSchema>;

type Request = {
  reconversionProjectProps: ReconversionProjectInputProps;
};

export class CreateReconversionProjectUseCase implements UseCase<Request, void> {
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly siteRepository: SiteRepository,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute({ reconversionProjectProps }: Request): Promise<void> {
    const parsedReconversionProject =
      await saveReconversionProjectPropsSchema.parseAsync(reconversionProjectProps);

    const doesRelatedSiteExist = await this.siteRepository.existsWithId(
      parsedReconversionProject.relatedSiteId,
    );
    if (!doesRelatedSiteExist) {
      throw new Error(`Site with id ${parsedReconversionProject.relatedSiteId} does not exist`);
    }

    const doesReconversionProjectExist = await this.reconversionProjectRepository.existsWithId(
      parsedReconversionProject.id,
    );
    if (doesReconversionProjectExist) {
      throw new Error(`ReconversionProject with id ${parsedReconversionProject.id} already exists`);
    }

    await this.reconversionProjectRepository.save({
      ...parsedReconversionProject,
      createdAt: this.dateProvider.now(),
      creationMode: "custom",
    });
  }
}
