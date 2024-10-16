import { SoilsDistribution } from "shared";
import { z } from "zod";

import { UseCase } from "src/shared-kernel/usecase";
import { Address } from "src/sites/core/models/site";

import { MixedUseNeighbourhoodProjectExpressCreationService } from "../model/create-from-site-services/MixedUseNeighbourhoodProjectExpressCreationService";
import { ReconversionProject, reconversionProjectSchema } from "../model/reconversionProject";

export type SiteView = {
  id: string;
  isFriche: boolean;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface?: number;
  address: Address;
  owner: {
    structureType: string;
    name?: string;
  };
};

export interface SiteQuery {
  getById(id: string): Promise<SiteView | undefined>;
}
export interface ReconversionProjectRepository {
  existsWithId(id: string): Promise<boolean>;
  save(reconversionProject: ReconversionProject): Promise<void>;
}

export interface DateProvider {
  now(): Date;
}

export const reconversionProjectPropsSchema = reconversionProjectSchema.omit({ createdAt: true });
export type ReconversionProjectProps = z.infer<typeof reconversionProjectPropsSchema>;

type Request = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
};

export class CreateExpressReconversionProjectUseCase implements UseCase<Request, void> {
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly siteQuery: SiteQuery,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute(props: Request): Promise<void> {
    const siteData = await this.siteQuery.getById(props.siteId);
    if (!siteData) {
      throw new Error(`Site with id ${props.siteId} does not exist`);
    }

    const creationService = new MixedUseNeighbourhoodProjectExpressCreationService(
      this.dateProvider,
      props.reconversionProjectId,
      props.createdBy,
      siteData,
    );
    const reconversionProject = creationService.getReconversionProject();

    await this.reconversionProjectRepository.save(reconversionProject);
  }
}
