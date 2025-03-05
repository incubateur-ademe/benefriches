import {
  Address,
  AgriculturalOrNaturalSiteSiteGenerator,
  FricheGenerator,
  SiteNature,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesRepository } from "../gateways/SitesRepository";
import { SiteEntity } from "../models/site";

type ExpressSiteProps = {
  id: string;
  surfaceArea: number;
  address: Address;
  nature: SiteNature;
  cityPopulation?: number;
};

type Request = {
  siteProps: ExpressSiteProps;
  createdBy: string;
};

export class CreateNewExpressSiteUseCase implements UseCase<Request, void> {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ siteProps, createdBy }: Request): Promise<void> {
    const site = new (siteProps.nature === "FRICHE"
      ? FricheGenerator
      : AgriculturalOrNaturalSiteSiteGenerator)().fromSurfaceAreaAndLocalInformation({
      id: siteProps.id,
      surfaceArea: siteProps.surfaceArea,
      address: siteProps.address,
      cityPopulation: siteProps.cityPopulation ?? 0,
    });

    if (await this.sitesRepository.existsWithId(site.id)) {
      throw new Error(`Site with id ${site.id} already exists`);
    }

    const siteEntity: SiteEntity = {
      ...site,
      createdAt: this.dateProvider.now(),
      createdBy,
      creationMode: "express",
    };

    await this.sitesRepository.save(siteEntity);
  }
}
