import { Address, SoilType } from "shared";

import { UseCase } from "src/shared-kernel/usecase";

import { SitesQuery } from "../gateways/SitesQuery";

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
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: { amount: number; purpose: string }[];
  fricheActivity?: string;
  description?: string;
};

export class SiteNotFoundError extends Error {
  constructor(readonly siteId: string) {
    super(`Site with ID ${siteId} not found`);
    this.name = "SiteNotFoundError";
  }
}

export class GetSiteByIdUseCase implements UseCase<Request, SiteViewModel> {
  constructor(private readonly sitesQuery: SitesQuery) {}

  async execute({ siteId }: Request): Promise<SiteViewModel> {
    const site = await this.sitesQuery.getById(siteId);

    if (!site) throw new SiteNotFoundError(siteId);

    return site;
  }
}
