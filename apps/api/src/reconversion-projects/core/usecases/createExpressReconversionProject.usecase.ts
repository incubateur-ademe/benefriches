import { z } from "zod";
import { UseCase } from "src/shared-kernel/usecase";
import { Address } from "src/sites/core/models/site";
import { SoilsDistribution } from "src/soils/domain/soils";
import { MixedUseNeighbourHoodReconversionProjectCreationService } from "../model/createReconversionProjectFromSite";
import { ReconversionProject, reconversionProjectSchema } from "../model/reconversionProject";

export type SiteView = {
  id: string;
  isFriche: boolean;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface?: number;
  address: Address;
};

export interface SiteRepository {
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
    private readonly siteRepository: SiteRepository,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute(props: Request): Promise<void> {
    const siteData = await this.siteRepository.getById(props.siteId);
    if (!siteData) {
      throw new Error(`Site with id ${props.siteId} does not exist`);
    }

    const creationService = new MixedUseNeighbourHoodReconversionProjectCreationService(
      this.dateProvider,
    );
    const reconversionProject = creationService.fromSiteData({
      createdBy: props.createdBy,
      reconversionProjectId: props.reconversionProjectId,
      siteData,
    });

    await this.reconversionProjectRepository.save(reconversionProject);
  }
}
