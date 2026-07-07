import { Address, AgriculturalOperationActivity, FricheActivity, NaturalAreaType } from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import type { AppLogger } from "src/shared-kernel/logger";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { CityRuralityQuery } from "src/territory/core/gateways/CityRuralityQuery";
import { CityStatsProvider } from "src/territory/core/gateways/CityStatsProvider";

import { createSiteCreatedEvent } from "../events/siteCreated.event";
import { SitesRepository } from "../gateways/SitesRepository";
import { AgriculturalOperationGenerator } from "../models/agriculturalOperationGenerator";
import { FricheGenerator } from "../models/fricheGenerator";
import { NaturalAreaGenerator } from "../models/naturalAreaGenerator";
import type { Site } from "../models/site";
import { SiteEntity } from "../models/siteEntity";

export type ExpressSiteProps = {
  id: string;
  surfaceArea: number;
  address: Address;
} & (
  | {
      nature: "FRICHE";
      fricheActivity: FricheActivity;
      builtSurfaceArea?: number;
      hasContaminatedSoils?: boolean;
    }
  | { nature: "AGRICULTURAL_OPERATION"; activity: AgriculturalOperationActivity }
  | { nature: "NATURAL_AREA"; type: NaturalAreaType }
);

type Request = {
  siteProps: ExpressSiteProps;
  createdBy: string;
};

type CreateNewExpressSiteResult = TResult<void, "SiteAlreadyExists">;

function createSite(
  props: ExpressSiteProps & { cityPopulation: number; isCityInRuralZone: boolean },
): Site {
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
  private readonly sitesRepository: SitesRepository;
  private readonly dateProvider: DateProvider;
  private readonly cityStatsQuery: CityStatsProvider;
  private readonly cityRuralityQuery: CityRuralityQuery;
  private readonly uuidGenerator: UidGenerator;
  private readonly eventPublisher: DomainEventPublisher;
  private readonly logger: AppLogger;
  constructor(
    sitesRepository: SitesRepository,
    dateProvider: DateProvider,
    cityStatsQuery: CityStatsProvider,
    cityRuralityQuery: CityRuralityQuery,
    uuidGenerator: UidGenerator,
    eventPublisher: DomainEventPublisher,
    logger: AppLogger,
  ) {
    this.sitesRepository = sitesRepository;
    this.dateProvider = dateProvider;
    this.cityStatsQuery = cityStatsQuery;
    this.cityRuralityQuery = cityRuralityQuery;
    this.uuidGenerator = uuidGenerator;
    this.eventPublisher = eventPublisher;
    this.logger = logger;
  }

  async execute({ siteProps, createdBy }: Request): Promise<CreateNewExpressSiteResult> {
    let siteCityPopulation = 0;
    let isCityInRuralZone = false;
    try {
      const [{ population }, isRural] = await Promise.all([
        this.cityStatsQuery.getCityStats(siteProps.address.cityCode),
        this.cityRuralityQuery.isCityRural(siteProps.address.cityCode),
      ]);
      siteCityPopulation = population;
      isCityInRuralZone = isRural;
    } catch (error) {
      this.logger.error("Failed to get city population", error);
    }

    const site = createSite({
      ...siteProps,
      cityPopulation: siteCityPopulation,
      isCityInRuralZone,
    });

    if (await this.sitesRepository.existsWithId(site.id)) {
      return fail("SiteAlreadyExists");
    }

    const siteEntity: SiteEntity = {
      ...site,
      createdAt: this.dateProvider.now(),
      createdBy,
      creationMode: "express",
      status: "active",
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
