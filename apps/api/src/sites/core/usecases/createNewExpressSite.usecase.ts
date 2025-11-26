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
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { createSiteCreatedEvent } from "../events/siteCreated.event";
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

type CreateNewExpressSiteResult = TResult<void, "SiteAlreadyExists">;

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

export class CreateNewExpressSiteUseCase implements UseCase<Request, CreateNewExpressSiteResult> {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly dateProvider: DateProvider,
    private readonly cityStatsQuery: CityStatsProvider,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({ siteProps, createdBy }: Request): Promise<CreateNewExpressSiteResult> {
    let siteCityPopulation = 0;
    try {
      const { population } = await this.cityStatsQuery.getCityStats(siteProps.address.cityCode);
      siteCityPopulation = population;
    } catch (error) {
      // oxlint-disable-next-line no-console
      console.error(error);
    }

    const site = createSite({ ...siteProps, cityPopulation: siteCityPopulation });

    if (await this.sitesRepository.existsWithId(site.id)) {
      return fail("SiteAlreadyExists");
    }

    const siteEntity: SiteEntity = {
      ...site,
      createdAt: this.dateProvider.now(),
      createdBy,
      creationMode: "express",
    };

    await this.sitesRepository.save(siteEntity);

    await this.eventPublisher.publish(
      createSiteCreatedEvent(this.uuidGenerator.generate(), {
        siteId: siteEntity.id,
        createdBy,
      }),
    );

    return success();
  }
}
