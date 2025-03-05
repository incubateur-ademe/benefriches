import {
  createAgriculturalOrNaturalSite,
  CreateAgriculturalOrNaturalSiteProps,
  createFriche,
  CreateFricheProps,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesRepository } from "../gateways/SitesRepository";
import { SiteEntity } from "../models/site";

type Request = {
  siteProps: { isFriche: boolean } & (CreateFricheProps | CreateAgriculturalOrNaturalSiteProps);
  createdBy: string;
};

export class CreateNewCustomSiteUseCase implements UseCase<Request, void> {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ siteProps, createdBy }: Request): Promise<void> {
    const result = siteProps.isFriche
      ? createFriche(siteProps as CreateFricheProps)
      : createAgriculturalOrNaturalSite(siteProps as CreateAgriculturalOrNaturalSiteProps);
    if (!result.success) {
      throw new Error(result.error);
    }

    if (await this.sitesRepository.existsWithId(result.site.id)) {
      throw new Error(`Site with id ${result.site.id} already exists`);
    }

    const siteEntity: SiteEntity = {
      ...result.site,
      creationMode: "custom",
      createdAt: this.dateProvider.now(),
      createdBy,
    };

    await this.sitesRepository.save(siteEntity);
  }
}
