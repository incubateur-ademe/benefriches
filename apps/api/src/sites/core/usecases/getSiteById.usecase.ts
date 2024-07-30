import { UseCase } from "src/shared-kernel/usecase";
import { SoilType } from "src/soils/domain/soils";
import { SitesReadRepository } from "../gateways/SitesReadRepository";
import { Address } from "../models/site";

type Request = {
  siteId: string;
};

export type SiteViewModel = {
  id: string;
  name: string;
  isFriche: boolean;
  isExpressSite: boolean;
  owner: {
    name?: string;
    structureType: string;
  };
  tenant?: {
    name?: string;
    structureType?: string;
  };
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: Partial<Record<SoilType, number>>;
  surfaceArea: number;
  address: Address;
  fullTimeJobsInvolved?: number;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: { amount: number; purpose: string }[];
  fricheActivity?: string;
  description?: string;
};

export class SiteNotFoundError extends Error {
  constructor(private readonly siteId: string) {
    super(`Site with ID ${siteId} not found`);
    this.name = "SiteNotFoundError";
  }
}

export class GetSiteByIdUseCase implements UseCase<Request, SiteViewModel> {
  constructor(private readonly sitesRepository: SitesReadRepository) {}

  async execute({ siteId }: Request): Promise<SiteViewModel> {
    const site = await this.sitesRepository.getById(siteId);

    if (!site) throw new SiteNotFoundError(siteId);

    return site;
  }
}
