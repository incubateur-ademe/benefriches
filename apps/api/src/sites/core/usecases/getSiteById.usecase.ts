import { Address, SiteNature, SoilType } from "shared";

import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesQuery } from "../gateways/SitesQuery";

type Request = {
  siteId: string;
};

export type SiteViewModel = {
  id: string;
  name: string;
  nature: SiteNature;
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
  yearlyIncomes: { amount: number; source: string }[];
  fricheActivity?: string;
  agriculturalOperationActivity?: string;
  naturalAreaType?: string;
  description?: string;
};

type GetSiteByIdResult = TResult<{ site: SiteViewModel }, "SiteNotFound">;

export class GetSiteByIdUseCase implements UseCase<Request, GetSiteByIdResult> {
  constructor(private readonly sitesQuery: SitesQuery) {}

  async execute({ siteId }: Request): Promise<GetSiteByIdResult> {
    const site = await this.sitesQuery.getById(siteId);

    if (!site) {
      return fail("SiteNotFound");
    }

    return success({ site });
  }
}
