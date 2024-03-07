import { UseCase } from "src/shared-kernel/usecase";
import { SoilsDistribution } from "src/soils/domain/soils";
import {
  computeContaminatedSurfaceAreaImpact,
  ContaminatedSurfaceAreaImpact,
} from "../model/impacts/contaminatedSurfaceAreaImpact";
import {
  computePermeableSurfaceAreaImpact,
  PermeableSurfaceAreaImpactResult,
} from "../model/impacts/permeableSurfaceAreaImpact";

type Site = {
  id: string;
  name: string;
  contaminatedSoilSurface?: number;
  soilsDistribution: SoilsDistribution;
};

export interface SiteRepository {
  getById(siteId: string): Promise<Site | undefined>;
}

type ReconversionProject = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: SoilsDistribution;
};

export interface ReconversionProjectRepository {
  getById(reconversionProjectId: string): Promise<ReconversionProject | undefined>;
}

type Request = {
  reconversionProjectId: string;
};

export type Result = {
  id: string;
  name: string;
  relatedSiteId: string;
  relatedSiteName: string;
  impacts: {
    contaminatedSurfaceArea?: ContaminatedSurfaceAreaImpact;
    permeableSurfaceArea: PermeableSurfaceAreaImpactResult;
  };
};

class ReconversionProjectNotFound extends Error {
  constructor(reconversionProjectId: string) {
    super(
      `ComputeReconversionProjectImpacts: ReconversionProject with id ${reconversionProjectId} not found`,
    );
    this.name = "ReconversionProjectNotFound";
  }
}

class SiteNotFound extends Error {
  constructor(siteId: string) {
    super(`ComputeReconversionProjectImpacts: Site with id ${siteId} not found`);
    this.name = "SiteNotFound";
  }
}

export class ComputeReconversionProjectImpactsUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
    private readonly siteRepository: SiteRepository,
  ) {}

  async execute({ reconversionProjectId }: Request): Promise<Result> {
    const reconversionProject =
      await this.reconversionProjectRepository.getById(reconversionProjectId);

    if (!reconversionProject) throw new ReconversionProjectNotFound(reconversionProjectId);

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) throw new SiteNotFound(reconversionProject.relatedSiteId);

    return {
      id: reconversionProjectId,
      name: reconversionProject.name,
      relatedSiteId: reconversionProject.relatedSiteId,
      relatedSiteName: relatedSite.name,
      impacts: {
        permeableSurfaceArea: computePermeableSurfaceAreaImpact({
          baseSoilsDistribution: relatedSite.soilsDistribution,
          forecastSoilsDistribution: reconversionProject.soilsDistribution,
        }),
        contaminatedSurfaceArea: relatedSite.contaminatedSoilSurface
          ? computeContaminatedSurfaceAreaImpact({
              currentContaminatedSurfaceArea: relatedSite.contaminatedSoilSurface,
            })
          : undefined,
      },
    };
  }
}
