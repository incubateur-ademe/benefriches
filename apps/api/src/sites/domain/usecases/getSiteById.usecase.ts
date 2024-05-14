import { UseCase } from "src/shared-kernel/usecase";
import { SoilType } from "src/soils/domain/soils";
import { SitesRepository } from "../gateways/SitesRepository";
import { Address } from "../models/site";

type Request = {
  siteId: string;
};

export type SiteViewModel = {
  id: string;
  name: string;
  isFriche: boolean;
  owner: {
    name?: string;
    structureType: string;
  };
  operator?: {
    name?: string;
    structureType?: string;
  };
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: Partial<Record<SoilType, number>>;
  surfaceArea: number;
  address: Address;
};

export class SiteNotFoundError extends Error {
  constructor(private readonly siteId: string) {
    super(`Site with ID ${siteId} not found`);
    this.name = "SiteNotFoundError";
  }
}

export class GetSiteByIdUseCase implements UseCase<Request, SiteViewModel> {
  constructor(private readonly sitesRepository: SitesRepository) {}

  async execute({ siteId }: Request): Promise<SiteViewModel> {
    const site = await this.sitesRepository.getById(siteId);

    if (!site) throw new SiteNotFoundError(siteId);

    return site;
  }
}
