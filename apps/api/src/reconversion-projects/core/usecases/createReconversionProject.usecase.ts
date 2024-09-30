import { z } from "zod";

import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProject, reconversionProjectSchema } from "../model/reconversionProject";

export interface SiteRepository {
  existsWithId(id: string): Promise<boolean>;
}
export interface ReconversionProjectRepository {
  existsWithId(id: string): Promise<boolean>;
  save(reconversionProject: ReconversionProject): Promise<void>;
}

export interface DateProvider {
  now(): Date;
}

export const reconversionProjectPropsSchema = reconversionProjectSchema.omit({
  createdAt: true,
  creationMode: true,
});
export type ReconversionProjectProps = z.infer<typeof reconversionProjectPropsSchema>;

type Request = {
  reconversionProjectProps: ReconversionProjectProps;
};

export class CreateReconversionProjectUseCase implements UseCase<Request, void> {
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly siteRepository: SiteRepository,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute({ reconversionProjectProps }: Request): Promise<void> {
    const parsedReconversionProject =
      await reconversionProjectPropsSchema.parseAsync(reconversionProjectProps);

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
