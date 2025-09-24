import {
  Address,
  AgriculturalOperationActivity,
  AgriculturalOperationGenerator,
  FricheActivity,
  FricheGenerator,
  NaturalAreaGenerator,
  NaturalAreaType,
  Site,
} from "shared";

import { CityStatsProvider } from "src/reconversion-projects/core/gateways/CityStatsProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesRepository } from "../gateways/SitesRepository";
import { SiteEntity } from "../models/siteEntity";

export type ExpressSiteProps = {
  id: string;
  surfaceArea: number;
  address: Address;
} & (
  | { nature: "FRICHE"; fricheActivity: FricheActivity; builtSurfaceArea?: number }
  | { nature: "AGRICULTURAL_OPERATION"; activity: AgriculturalOperationActivity }
  | { nature: "NATURAL_AREA"; type: NaturalAreaType }
);

type Request = {
  siteProps: ExpressSiteProps;
  createdBy: string;
};

function createSite(props: ExpressSiteProps & { cityPopulation: number }): Site {
  switch (props.nature) {
    case "FRICHE":
      return new FricheGenerator().fromSurfaceAreaAndLocalInformation(props);
    case "AGRICULTURAL_OPERATION":
      return new AgriculturalOperationGenerator().fromSurfaceAreaAndLocalInformation({
        ...props,
        operationActivity: props.activity,
      });
    case "NATURAL_AREA":
      return new NaturalAreaGenerator().fromSurfaceAreaAndLocalInformation({
        ...props,
        naturalAreaType: props.type,
      });
  }
}

export class CreateNewExpressSiteUseCase implements UseCase<Request, void> {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly dateProvider: DateProvider,
    private readonly cityStatsQuery: CityStatsProvider,
  ) {}

  async execute({ siteProps, createdBy }: Request): Promise<void> {
    let siteCityPopulation = 0;
    try {
      const { population } = await this.cityStatsQuery.getCityStats(siteProps.address.cityCode);
      siteCityPopulation = population;
    } catch (error) {
      console.error(error);
    }

    const site = createSite({ ...siteProps, cityPopulation: siteCityPopulation });

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
