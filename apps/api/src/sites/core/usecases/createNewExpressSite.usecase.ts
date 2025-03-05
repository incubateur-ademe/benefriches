import {
  Address,
  AgriculturalOrNaturalSiteSiteGenerator,
  FricheGenerator,
  SiteNature,
} from "shared";

import { CityDataProvider } from "src/reconversion-projects/core/gateways/CityDataProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesRepository } from "../gateways/SitesRepository";
import { SiteEntity } from "../models/siteEntity";

type ExpressSiteProps = {
  id: string;
  surfaceArea: number;
  address: Address;
  nature: SiteNature;
};

type Request = {
  siteProps: ExpressSiteProps;
  createdBy: string;
};

export class CreateNewExpressSiteUseCase implements UseCase<Request, void> {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly dateProvider: DateProvider,
    private readonly cityDataProvider: CityDataProvider,
  ) {}

  async execute({ siteProps, createdBy }: Request): Promise<void> {
    let siteCityPopulation = 0;
    try {
      const { population } = await this.cityDataProvider.getCitySurfaceAreaAndPopulation(
        siteProps.address.cityCode,
      );
      siteCityPopulation = population;
    } catch (error) {
      console.error(error);
    }

    const site = new (siteProps.nature === "FRICHE"
      ? FricheGenerator
      : AgriculturalOrNaturalSiteSiteGenerator)().fromSurfaceAreaAndLocalInformation({
      id: siteProps.id,
      surfaceArea: siteProps.surfaceArea,
      address: siteProps.address,
      cityPopulation: siteCityPopulation,
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
